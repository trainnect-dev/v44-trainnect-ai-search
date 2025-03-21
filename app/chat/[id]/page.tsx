import { createClient } from "@/utils/supabase/server-client";
import { NextResponse } from "next/server";
import { getChatSessionMessages } from "@/lib/supabase/chat-history";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }
  
  // Fetch the chat session
  const { data: chatSession, error: chatSessionError } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', params.id)
    .single();
  
  if (chatSessionError || !chatSession) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }
  
  // Check if the user owns this chat session
  if (chatSession.user_id !== session.user.id) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }
  
  // Fetch the chat messages
  const messages = await getChatSessionMessages(params.id);
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <h1 className="text-2xl font-bold mb-4">{chatSession.title}</h1>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                : "bg-muted text-muted-foreground max-w-[80%]"
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      
      {/* Chat input would go here */}
      <div className="border-t pt-4">
        <p className="text-center text-muted-foreground">
          Chat functionality is being implemented. Please check back later.
        </p>
      </div>
    </div>
  );
}
