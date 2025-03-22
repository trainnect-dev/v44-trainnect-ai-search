"use client";

import cn from "classnames";
import Markdown from "react-markdown";
import { markdownComponents } from "./markdown-components";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, SpinnerIcon } from "./icons";
import { UIMessage } from "ai";
import { UseChatHelpers } from "@ai-sdk/react";
import Image from "next/image";
import { CopyButton } from "./copy-icon";

interface ReasoningPart {
  type: "reasoning";
  reasoning: string;
  details: Array<{ type: "text"; text: string }>;
}

interface ReasoningMessagePartProps {
  part: ReasoningPart;
  isReasoning: boolean;
}

export function ReasoningMessagePart({
  part,
  isReasoning,
}: ReasoningMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const variants = {
    collapsed: {
      height: 0,
      opacity: 0,
      marginTop: 0,
      marginBottom: 0,
    },
    expanded: {
      height: "auto",
      opacity: 1,
      marginTop: "1rem",
      marginBottom: 0,
    },
  };

  return (
    <div className="flex flex-col">
      {isReasoning ? (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoning</div>
          <div className="animate-spin">
            <SpinnerIcon />
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-2 items-center">
          <div className="font-medium text-sm">Reasoned for a few seconds</div>
          <button
            className={cn(
              "cursor-pointer rounded-full dark:hover:bg-zinc-800 hover:bg-zinc-200",
              {
                "dark:bg-zinc-800 bg-zinc-200": isExpanded,
              },
            )}
            onClick={() => {
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
          </button>
        </div>
      )}

      <motion.div
        key="reasoning"
        className="text-sm dark:text-zinc-400 text-zinc-600 flex flex-col gap-4 border-l pl-3 dark:border-zinc-800"
        initial="collapsed"
        animate="expanded"
        exit="collapsed"
        variants={variants}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {part.details.map((detail, detailIndex) =>
          detail.type === "text" ? (
            <Markdown key={detailIndex} components={markdownComponents}>
              {detail.text}
            </Markdown>
          ) : (
            "<redacted>"
          ),
        )}
      </motion.div>
    </div>
  );
}

interface TextMessagePartProps {
  text: string;
}

export function TextMessagePart({ text }: TextMessagePartProps) {
  return (
    <div className="flex flex-col gap-4">
      <Markdown components={markdownComponents}>{text}</Markdown>
    </div>
  );
}

interface AttachmentProps {
  attachment: {
    name?: string;
    url: string;
    contentType: string;
  };
  index: number;
  messageId: string;
}

export function Attachment({ attachment, index, messageId }: AttachmentProps) {
  if (attachment.contentType.startsWith('image/')) {
    return (
      <div className="mt-2 relative w-full max-w-md h-auto">
        <Image
          key={`${messageId}-${index}`}
          src={attachment.url}
          alt={attachment.name || `attachment-${index}`}
          width={500}
          height={300}
          className="rounded-md object-contain"
          style={{ maxHeight: '300px' }}
        />
      </div>
    );
  } else if (attachment.contentType.startsWith('application/pdf')) {
    return (
      <div className="mt-2 w-full max-w-md">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-md flex items-center gap-2 mb-2">
          <div className="text-sm font-medium">PDF Document: {attachment.name || `Document-${index}`}</div>
        </div>
        <iframe
          key={`${messageId}-${index}`}
          src={attachment.url}
          title={attachment.name || `attachment-${index}`}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700"
          height={400}
        />
      </div>
    );
  }
  
  return null;
}

interface MessagesProps {
  messages: Array<UIMessage>;
  status: UseChatHelpers["status"];
}

export function Messages({ messages, status }: MessagesProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const messagesLength = useMemo(() => messages.length, [messages]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messagesLength]);

  return (
    <div
      className="flex flex-col gap-8 overflow-y-scroll items-center w-full"
      ref={messagesRef}
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex flex-col gap-4 last-of-type:mb-12 first-of-type:mt-16 md:w-1/2 w-full",
          )}
        >
          <div
            className={cn("flex flex-col gap-4", {
              "dark:bg-zinc-800 bg-zinc-200 p-2 rounded-xl w-fit ml-auto":
                message.role === "user",
              "relative": message.role === "assistant",
            })}
          >
            {message.role === "assistant" && (
              <div className="absolute -left-10 top-0">
                <CopyButton 
                  content={message.parts
                    .filter(part => part.type === "text")
                    .map(part => (part.type === "text" ? part.text : ""))
                    .join("\n")} 
                />
              </div>
            )}
            {/* Display message text content */}
            {message.parts.map((part, partIndex) => {
              if (part.type === "text") {
                return (
                  <TextMessagePart
                    key={`${message.id}-${partIndex}`}
                    text={part.text}
                  />
                );
              }
              
              return null;
            })}
            
            {/* Display attachments if present */}
            {message.experimental_attachments && message.experimental_attachments.length > 0 && (
              <div className="flex flex-col gap-2">
                {message.experimental_attachments.map((attachment, attachmentIndex) => {
                  // Ensure attachment has required properties before rendering
                  if (attachment && attachment.url && attachment.contentType) {
                    return (
                      <Attachment 
                        key={`${message.id}-attachment-${attachmentIndex}`}
                        attachment={{
                          name: attachment.name,
                          url: attachment.url,
                          contentType: attachment.contentType
                        }}
                        index={attachmentIndex}
                        messageId={message.id}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </div>
      ))}

      {status === "submitted" && (
        <div className="text-zinc-500 mb-12 md:w-1/2 w-full">Hmm...</div>
      )}
    </div>
  );
}
