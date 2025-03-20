"use client";

import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export function NewChatButton() {
  const { open } = useSidebar();
  const router = useRouter();
  const supabase = createClient();

  const handleNewChat = async () => {
    try {
      // Get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        console.error('User not authenticated:', userError);
        toast.error("You must be logged in to create a new chat");
        return;
      }
      
      // Create a new chat session in Supabase
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([
          {
            title: "New Chat",
            user_id: userData.user.id,
          },
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating chat session:', error);
        toast.error("Failed to start a new chat");
        return;
      }
      
      // Force a refresh of the current page to reset the chat state
      router.refresh();
      
      // Show success message
      toast.success("Started a new chat");
    } catch (error) {
      console.error("Error creating new chat:", error);
      toast.error("Failed to start a new chat");
    }
  };

  return (
    <button
      onClick={handleNewChat}
      className={cn(
        "flex items-center gap-2 text-muted-foreground hover:text-foreground px-3 py-2 rounded-md hover:bg-accent transition-colors"
      )}
    >
      <PlusCircle size={20} />
      <motion.span
        animate={{
          opacity: open ? 1 : 0,
          transition: { duration: 0.2 },
        }}
        className="text-sm whitespace-pre"
      >
        New Chat
      </motion.span>
    </button>
  );
}
