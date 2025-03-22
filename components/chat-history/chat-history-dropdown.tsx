"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Trash2, Copy, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChatSession, TimeFilter } from "@/lib/types/chat-history";
import { useSidebar } from "../sidebar";

interface ChatHistoryDropdownProps {
  className?: string;
}

export function ChatHistoryDropdown({ className }: ChatHistoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('7');
  const supabase = createClient();
  const router = useRouter();
  const { open } = useSidebar();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchChatSessions();
    }
  };

  const fetchChatSessions = async () => {
    setIsLoading(true);
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        setIsLoading(false);
        return;
      }
      
      // Build the query
      let query = supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      // Apply time filter if not 'all'
      if (timeFilter !== 'all') {
        // Convert days to milliseconds
        const daysInMs = parseInt(timeFilter) * 24 * 60 * 60 * 1000;
        const fromDate = new Date(Date.now() - daysInMs).toISOString();
        
        query = query.gte('updated_at', fromDate);
      }
      
      // Execute the query
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching chat sessions:', error);
        toast.error('Failed to load chat history');
        setChatSessions([]);
      } else {
        setChatSessions(data || []);
      }
    } catch (error) {
      console.error('Error in fetchChatSessions:', error);
      toast.error('An unexpected error occurred');
      setChatSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sessions when the time filter changes
  useEffect(() => {
    if (isOpen) {
      fetchChatSessions();
    }
  }, [timeFilter]);

  const handleSessionClick = (sessionId: string) => {
    router.push(`/chat/${sessionId}`);
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    
    try {
      // Delete the session
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) {
        console.error('Error deleting chat session:', error);
        toast.error('Failed to delete chat session');
        return;
      }
      
      // Delete all messages associated with the session
      await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId);
      
      // Update the local state
      setChatSessions(chatSessions.filter(session => session.id !== sessionId));
      toast.success('Chat session deleted');
    } catch (error) {
      console.error('Error in handleDeleteSession:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleCopyToClipboard = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    
    try {
      // Fetch the messages for this session
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching chat messages:', error);
        toast.error('Failed to copy chat content');
        return;
      }
      
      // Format the messages
      const formattedMessages = data.map(msg => 
        `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`
      ).join('\n\n');
      
      // Copy to clipboard
      await navigator.clipboard.writeText(formattedMessages);
      toast.success('Chat content copied to clipboard');
    } catch (error) {
      console.error('Error in handleCopyToClipboard:', error);
      toast.error('Failed to copy chat content');
    }
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
                  <span className="truncate flex-1">{session.title && session.title !== 'New Chat' ? session.title : 'Untitled Chat'}</span>
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
