import { createClient } from "@/utils/supabase/server-client";
import { ChatMessage, ChatSession, TimeFilter } from "../types/chat-history";

export async function getChatSessions(timeFilter: TimeFilter = 'all'): Promise<ChatSession[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('chat_sessions')
    .select('*')
    .order('updated_at', { ascending: false });
  
  if (timeFilter !== 'all') {
    // Convert days to milliseconds
    const daysInMs = parseInt(timeFilter) * 24 * 60 * 60 * 1000;
    const fromDate = new Date(Date.now() - daysInMs).toISOString();
    
    query = query.gte('updated_at', fromDate);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching chat sessions:', error);
    return [];
  }
  
  return data as ChatSession[];
}

export async function getChatSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
  
  return data as ChatMessage[];
}

export async function createChatSession(title: string): Promise<ChatSession | null> {
  const supabase = await createClient();
  
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error('User not authenticated:', userError);
    return null;
  }
  
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([
      {
        title,
        user_id: userData.user.id,
      },
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating chat session:', error);
    return null;
  }
  
  return data as ChatSession;
}

export async function saveChatMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<ChatMessage | null> {
  const supabase = await createClient();
  
  // First, update the session's updated_at timestamp
  await supabase
    .from('chat_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', sessionId);
  
  // Then, insert the new message
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([
      {
        session_id: sessionId,
        role,
        content,
      },
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving chat message:', error);
    return null;
  }
  
  return data as ChatMessage;
}

export async function deleteChatSession(sessionId: string): Promise<boolean> {
  const supabase = await createClient();
  
  // First, delete all messages in the session
  const { error: messagesError } = await supabase
    .from('chat_messages')
    .delete()
    .eq('session_id', sessionId);
  
  if (messagesError) {
    console.error('Error deleting chat messages:', messagesError);
    return false;
  }
  
  // Then, delete the session itself
  const { error: sessionError } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);
  
  if (sessionError) {
    console.error('Error deleting chat session:', sessionError);
    return false;
  }
  
  return true;
}
