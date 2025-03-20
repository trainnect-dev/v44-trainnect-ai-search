"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Trash2, Copy, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "../sidebar";
import { ChatSession, TimeFilter } from "@/lib/types/chat-history";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ChatHistoryDropdownProps {
  className?: string;
}

export function ChatHistoryDropdown({ className }: ChatHistoryDropdownProps) {
  const { open } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      fetchChatSessions();
    }
  }, [isOpen, timeFilter]);

  const fetchChatSessions = async () => {
    setIsLoading(true);
    try {
      // Convert days to milliseconds
      let fromDate: string | null = null;
      if (timeFilter !== 'all') {
        const daysInMs = parseInt(timeFilter) * 24 * 60 * 60 * 1000;
        fromDate = new Date(Date.now() - daysInMs).toISOString();
      }
      
      let query = supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (fromDate) {
        query = query.gte('updated_at', fromDate);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching chat sessions:', error);
        toast.error('Failed to load chat history');
        return;
      }
      
      setChatSessions(data as ChatSession[]);
    } catch (error) {
      console.error('Error in fetchChatSessions:', error);
      toast.error('Failed to load chat history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    try {
      // Delete all messages in the session first
      await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);
      
      // Then delete the session
      await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);
      
      // Update the local state
      setChatSessions((prev: ChatSession[]) => prev.filter((session: ChatSession) => session.id !== sessionId));
      toast.success('Chat session deleted');
    } catch (error) {
      console.error('Error deleting chat session:', error);
      toast.error('Failed to delete chat session');
    }
  };

  const handleCopyToClipboard = async (sessionId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      const formattedChat = data.map((msg: any) => 
        `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      
      // Create a temporary textarea element to copy text
      const textArea = document.createElement('textarea');
      textArea.value = formattedChat;
      // Make the textarea out of viewport
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        // Use the older document.execCommand method which has better browser support
        const success = document.execCommand('copy');
        if (success) {
          toast.success('Chat copied to clipboard');
        } else {
          toast.error('Failed to copy chat to clipboard');
        }
      } catch (err) {
        console.error('Error copying text: ', err);
        toast.error('Failed to copy chat to clipboard');
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (error) {
      console.error('Error copying chat to clipboard:', error);
      toast.error('Failed to copy chat to clipboard');
    }
  };

  const handleSessionClick = (sessionId: string) => {
    // Implement logic to restore chat session
    router.push(`/chat/${sessionId}`);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={toggleDropdown}
        className={cn(
          "flex items-center gap-2 text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors w-full"
        )}
      >
        {open && <History size={18} />}
        {open && (
          <motion.span
            animate={{
              opacity: open ? 1 : 0,
              transition: { duration: 0.2 },
            }}
            className="text-sm whitespace-pre flex-1 text-left"
          >
            Recent
          </motion.span>
        )}
      </button>

      {isOpen && open && (
        <div className="flex flex-col w-full">
          {/* 7d Filter */}
          <button
            onClick={() => setTimeFilter('7')}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full",
              timeFilter === '7' && "text-foreground bg-accent/50"
            )}
          >
            <div className="w-4"></div> {/* Spacer for indentation */}
            <History size={14} />
            <span>Last 7 days</span>
          </button>

          {/* 14d Filter */}
          <button
            onClick={() => setTimeFilter('14')}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full",
              timeFilter === '14' && "text-foreground bg-accent/50"
            )}
          >
            <div className="w-4"></div> {/* Spacer for indentation */}
            <History size={14} />
            <span>Last 14 days</span>
          </button>

          {/* 30d Filter */}
          <button
            onClick={() => setTimeFilter('30')}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full",
              timeFilter === '30' && "text-foreground bg-accent/50"
            )}
          >
            <div className="w-4"></div> {/* Spacer for indentation */}
            <History size={14} />
            <span>Last 30 days</span>
          </button>

          {/* All Filter */}
          <button
            onClick={() => setTimeFilter('all')}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full",
              timeFilter === 'all' && "text-foreground bg-accent/50"
            )}
          >
            <div className="w-4"></div> {/* Spacer for indentation */}
            <History size={14} />
            <span>All history</span>
          </button>

          {/* Chat Sessions */}
          {isLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          ) : chatSessions.length === 0 ? (
            <div className="px-8 py-4 text-sm text-muted-foreground">
              No chat history found
            </div>
          ) : (
            <div className="flex flex-col">
              {chatSessions.map((session: ChatSession) => (
                <div
                  key={session.id}
                  onClick={() => handleSessionClick(session.id)}
                  className="flex items-center gap-2 px-8 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full cursor-pointer group"
                >
                  <span className="truncate flex-1">{session.title || 'Untitled Chat'}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleCopyToClipboard(session.id, e)}
                      className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-background"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-background"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
