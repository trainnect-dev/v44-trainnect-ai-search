import { Toaster } from 'sonner';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import type { Metadata } from 'next';
import { LayoutDashboard, Search, MessageSquare, Bot } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink, ChatHistoryDropdown } from '@/components/sidebar';
import { NewChatButton } from '../components/new-chat-button';
import { createClient } from '@/utils/supabase/server-client';

import './globals.css';

export const metadata: Metadata = {
  title: 'Multi-LLM-AI',
  description:
    'Multi-LLM-AI.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Create Supabase client
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;
  
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen">
        <Toaster position="top-center" />
        <div className="flex">
          {isAuthenticated && (
            <Sidebar>
              <SidebarBody>
                <div className="flex flex-col gap-2">
                  <SidebarLink
                    link={{
                      label: "Dashboard",
                      href: "/",
                      icon: <LayoutDashboard size={20} />,
                    }}
                  />
                  <NewChatButton />
                  <SidebarLink
                    link={{
                      label: "AI Chat",
                      href: "/",
                      icon: <MessageSquare size={20} />,
                    }}
                  />
                  <SidebarLink
                    link={{
                      label: "AI Search",
                      href: "/tavily-ai-search",
                      icon: <Search size={20} />,
                    }}
                  />
                  <SidebarLink
                    link={{
                      label: "AI Agents",
                      href: "/ai-agents",
                      icon: <Bot size={20} />,
                    }}
                  />
                  {/* Chat History Dropdown Component */}
                  <ChatHistoryDropdown />
                </div>
              </SidebarBody>
            </Sidebar>
          )}
          <main className={`${isAuthenticated ? 'flex-1' : 'w-full'} p-4 md:p-8`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
