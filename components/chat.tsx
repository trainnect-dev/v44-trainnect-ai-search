"use client";

import cn from "classnames";
import { toast } from "sonner";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Messages } from "./messages";
import { models } from "@/lib/models";
import { Footnote } from "./footnote";
import { ArrowUpIcon, CheckedSquare, StopIcon, UncheckedSquare, PaperClipIcon, XIcon } from "./icons";
import { ModelSelector } from "./model-selector";
import { Input } from "./input";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { uploadFile } from "@/utils/supabase/storage";

interface ChatProps {
  sessionId?: string;
}

export function Chat({ sessionId: existingSessionId }: ChatProps) {
  const [input, setInput] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("claude-3.7-sonnet");
  const [isReasoningEnabled, setIsReasoningEnabled] = useState<boolean>(true);
  const [files, setFiles] = useState<FileList | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(existingSessionId || null);
  const [initialMessages, setInitialMessages] = useState<Array<{id: string; role: 'user' | 'assistant'; content: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  // Generate a unique chat ID for each page load to ensure proper reset
  const chatId = useRef<string>(`chat-${Date.now()}`).current;

  // Default values for the following features 
  const reasoningModeEnabled = true;
  const multimodalEnabled = true;

  const selectedModel = models.find((model) => model.id === selectedModelId);

  // Create a new chat session when the component mounts
  useEffect(() => {
    const createSession = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error('User not authenticated:', userError);
          return;
        }
        
        const { data, error } = await supabase
          .from('chat_sessions')
          .insert([
            {
              title: 'Untitled Chat',
              user_id: user.id,
            },
          ])
          .select()
          .single();
        
        if (error) {
          console.error('Error creating chat session:', error);
          return;
        }
        
        setSessionId(data.id);
      } catch (error) {
        console.error('Error in createSession:', error);
      }
    };
    
    const loadExistingSession = async () => {
      if (!existingSessionId) return;
      
      try {
        // Fetch messages for the existing session
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', existingSessionId)
          .order('created_at', { ascending: true });
        
        if (error) {
          console.error('Error loading chat messages:', error);
          toast.error('Failed to load chat history');
          return;
        }
        
        // Convert the messages to the format expected by useChat
        const initialMessages = data.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }));
        
        // We'll use these messages to initialize the chat
        setInitialMessages(initialMessages);
      } catch (error) {
        console.error('Error in loadExistingSession:', error);
        toast.error('An error occurred while loading the chat');
      }
    };
    
    if (existingSessionId) {
      loadExistingSession();
    } else {
      createSession();
    }
  }, [existingSessionId, supabase]);

  const { messages, append, status, stop } = useChat({
    id: chatId,
    body: {
      selectedModelId,
      isReasoningEnabled: reasoningModeEnabled ? isReasoningEnabled : false,
    },
    initialMessages,
    onError: () => {
      toast.error("An error occurred, please try again!");
    },
    onResponse: async (response: any) => {
      // Save the assistant's response to the database
      if (sessionId) {
        try {
          await supabase
            .from('chat_messages')
            .insert([
              {
                session_id: sessionId,
                role: 'assistant',
                content: typeof response.content === 'string' ? response.content : JSON.stringify(response.content),
                file_urls: null, // Assistant doesn't upload files
              },
            ]);
          
          // Update the session's updated_at timestamp
          await supabase
            .from('chat_sessions')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', sessionId);
        } catch (error) {
          console.error('Error saving assistant message:', error);
        }
      }
    },
  });

  const isGeneratingResponse = ["streaming", "submitted"].includes(status);

  const handleSendMessage = async () => {
    if (input === "" && (!files || files.length === 0)) {
      return;
    }

    if (isGeneratingResponse) {
      stop();
    } else {
      // Upload files to Supabase Storage if present
      let fileUrls: string[] = [];
      let attachments = undefined;
      
      if (files && files.length > 0) {
        try {
          // Upload each file to Supabase Storage
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
              const fileUrl = await uploadFile(file);
              fileUrls.push(fileUrl);
            } catch (uploadError) {
              console.error(`Error uploading file ${file.name}:`, uploadError);
              toast.error(`Failed to upload ${file.name}`);
              // Continue with other files
            }
          }
          
          // Still use the original files for the AI SDK
          attachments = files;
          
        } catch (error) {
          console.error('Error handling file uploads:', error);
          toast.error('Failed to process files');
          // Continue with the chat even if file upload fails
        }
      }
      
      // Save the user's message to the database
      if (sessionId) {
        try {
          await supabase
            .from('chat_messages')
            .insert([
              {
                session_id: sessionId,
                role: 'user',
                content: input,
                file_urls: fileUrls.length > 0 ? fileUrls : null,
              },
            ]);
          
          // Update the session's title with the first few words of the first message
          if (messages.length === 0) {
            // Create a more descriptive title from the user's first message
            // Take up to 5 words, but ensure we don't cut off in the middle of a word
            const words = input.split(' ');
            const titleWords = words.slice(0, Math.min(5, words.length));
            const title = titleWords.join(' ') + (words.length > 5 ? '...' : '');
            
            await supabase
              .from('chat_sessions')
              .update({ 
                title,
                updated_at: new Date().toISOString() 
              })
              .eq('id', sessionId);
          } else {
            // Just update the timestamp
            await supabase
              .from('chat_sessions')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', sessionId);
          }
        } catch (error) {
          console.error('Error saving user message:', error);
        }
      }
      
      append({
        role: "user",
        content: input,
      }, {
        experimental_attachments: attachments,
      });
    }

    setInput("");
    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Create file preview URL
  const filePreviewUrl = files && files.length > 0 && files[0].type.startsWith('image/') 
    ? URL.createObjectURL(files[0]) 
    : null;

  return (
    <div
      className={cn(
        "px-4 md:px-0 pb-4 pt-8 flex flex-col h-dvh items-center w-full",
        {
          "justify-between": messages.length > 0,
          "justify-center gap-4": messages.length === 0,
        },
      )}
    >
      {messages.length > 0 ? (
        <Messages messages={messages} status={status} />
      ) : (
        <div className="flex flex-col gap-0.5 sm:text-2xl text-xl md:w-1/2 w-full">
          <div className="flex flex-row gap-2 items-center">
            <div>GK-AI.</div>
          </div>
          <div className="dark:text-zinc-500 text-zinc-400">
            A Powerful Multi-LLM-AI, Built by Gregory Kennedy
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 md:w-1/2 w-full">
        <div className="w-full relative p-3 dark:bg-zinc-800 rounded-2xl flex flex-col gap-1 bg-zinc-100">
          {multimodalEnabled && files && files.length > 0 && (
            <div className="mb-2 flex items-center" data-testid="file-preview">
              {filePreviewUrl ? (
                <div className="relative w-16 h-16 mr-2">
                  <Image 
                    src={filePreviewUrl} 
                    alt={files[0].name}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-md"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-md mr-2">
                  <span className="text-xs">{files[0].name.split('.').pop()?.toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="text-sm truncate">{files[0].name}</div>
                <div className="text-xs text-zinc-500">{(files[0].size / 1024).toFixed(1)} KB</div>
              </div>
              <button 
                onClick={handleRemoveFile}
                className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          )}
          
          <Input
            input={input}
            setInput={setInput}
            selectedModelId={selectedModelId}
            isGeneratingResponse={isGeneratingResponse}
            isReasoningEnabled={reasoningModeEnabled ? isReasoningEnabled : false}
            append={append}
          />

          {reasoningModeEnabled && (
            <div className="absolute bottom-2.5 left-2.5">
              <div
                className={cn(
                  "relative w-fit text-sm p-1.5 rounded-lg flex flex-row items-center gap-2 dark:hover:bg-zinc-600 hover:bg-zinc-200 cursor-pointer",
                  {
                    "dark:bg-zinc-600 bg-zinc-200": isReasoningEnabled,
                  },
                )}
                onClick={() => {
                  setIsReasoningEnabled(!isReasoningEnabled);
                }}
              >
                {isReasoningEnabled ? <CheckedSquare /> : <UncheckedSquare />}
                <div>Reasoning</div>
              </div>
            </div>
          )}

          <div className="absolute bottom-2.5 right-2.5 flex flex-row gap-2">
            {multimodalEnabled && (
              <button
                className="size-8 flex flex-row justify-center items-center dark:bg-zinc-700 bg-zinc-300 dark:text-zinc-300 text-zinc-700 p-1.5 rounded-full hover:bg-zinc-400 dark:hover:bg-zinc-600 hover:scale-105 active:scale-95 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                <PaperClipIcon />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFiles(e.target.files)}
                  ref={fileInputRef}
                  accept="image/*, application/pdf"
                  data-testid="file-upload"
                />
              </button>
            )}
            
            <ModelSelector 
              selectedModelId={selectedModelId}
              setSelectedModelId={setSelectedModelId}
            />

            <button
              className={cn(
                "size-8 flex flex-row justify-center items-center dark:bg-zinc-100 bg-zinc-900 dark:text-zinc-900 text-zinc-100 p-1.5 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-300 hover:scale-105 active:scale-95 transition-all",
                {
                  "dark:bg-zinc-200 dark:text-zinc-500":
                    isGeneratingResponse || (input === "" && (!files || files.length === 0)),
                },
              )}
              onClick={handleSendMessage}
              aria-label="send"
            >
              {isGeneratingResponse ? <StopIcon /> : <ArrowUpIcon />}
            </button>
          </div>
        </div>

        <Footnote />
      </div>
    </div>
  );
}
