import { createClient } from "@/utils/supabase/server-client";
import { getChatSessionMessages } from "@/lib/supabase/chat-history";
import { Chat } from "@/components/chat";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Redirect to login page
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/auth/login",
      },
    });
  }
  
  // Fetch the chat session
  const { data: chatSession, error: chatSessionError } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', params.id)
    .single();
  
  if (chatSessionError || !chatSession) {
    // Return 404 if chat session not found
    return new Response(null, {
      status: 404,
    });
  }
  
  // Check if the user owns this chat session
  if (session.user.id === null || chatSession.user_id !== session.user.id) {
    // Redirect to home page
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="w-full">
        <Chat sessionId={params.id} />
      </div>
    </div>
  );
}
