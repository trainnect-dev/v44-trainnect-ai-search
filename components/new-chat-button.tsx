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
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const supabase = createClient();

  const handleNewChat = async () => {
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        toast.error("You must be logged in to create a new chat");
        router.push("/auth/login");
        return;
      }
      
      // Determine the appropriate action based on the current path
      if (pathname === "/" || pathname.startsWith("/chat")) {
        // For AI Chat, simply redirect to the home page
        // The Chat component will create a new session when mounted
        router.push("/");
        toast.success("Started a new AI Chat session");
      } else if (pathname.startsWith("/tavily-ai-search")) {
        // For AI Search, redirect to the search page
        router.push("/tavily-ai-search");
        toast.success("Started a new AI Search session");
      } else if (pathname.startsWith("/ai-agents")) {
        // For AI Agents, redirect to the agents page
        router.push("/ai-agents");
        toast.success("Started a new AI Agent session");
      } else {
        // Default to AI Chat
        router.push("/");
        toast.success("Started a new AI Chat session");
      }
    } catch (error) {
      console.error('Error in handleNewChat:', error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <motion.button
      onClick={handleNewChat}
      className={cn(
        "flex items-center gap-2 px-2 py-2 rounded-md hover:bg-accent",
        open ? "justify-start" : "justify-center"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <PlusCircle size={20} />
      {open && <span className="text-sm">New Chat</span>}
    </motion.button>
  );
}
