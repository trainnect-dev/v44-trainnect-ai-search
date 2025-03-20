# Supabase Integration for Trainnect AI Search

This directory contains the necessary files and instructions for integrating Supabase with the Trainnect AI Search application.

## Setup Instructions

### 1. Environment Variables

Make sure the following environment variables are set in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Database Schema

The `schema.sql` file in this directory contains the SQL statements needed to set up the database schema for the chat history feature. You can run these statements in the Supabase SQL editor to create the necessary tables and policies.

### 3. Authentication

Supabase authentication is handled automatically through the middleware. The application uses cookie-based authentication to maintain user sessions.

The authentication flow is as follows:
1. Users sign in through your existing authentication system
2. The middleware in `utils/supabase/middleware.ts` refreshes the session on each request
3. Server components use the server-side Supabase client from `utils/supabase/server.ts`
4. Client components use the browser-side Supabase client from `utils/supabase/client.ts`

### 4. Chat History Feature

The chat history feature allows users to:

- View their chat history in the sidebar
- Filter chat sessions by time (7 days, 14 days, 30 days, or all)
- Copy chat sessions to the clipboard
- Delete chat sessions
- Restore previous chat sessions

## Features Implemented

### Chat History

- Chat sessions are stored in the `chat_sessions` table
- Chat messages are stored in the `chat_messages` table
- Users can view, create, and delete their chat history
- Chat history is filtered by time (7 days, 14 days, 30 days, or all)
- Chat sessions can be exported to clipboard

## File Structure

- `schema.sql` - SQL schema for the Supabase database
- `../utils/supabase/server.ts` - Server-side Supabase client
- `../utils/supabase/client.ts` - Client-side Supabase client
- `../utils/supabase/middleware.ts` - Middleware for session handling
- `../lib/types/chat-history.ts` - TypeScript interfaces for chat history
- `../lib/supabase/chat-history.ts` - Functions for interacting with chat history
- `../components/chat-history/chat-history-dropdown.tsx` - UI component for chat history

## Row Level Security (RLS) Policies

The database is configured with Row Level Security to ensure that users can only access their own data. The policies are defined in the `schema.sql` file and include:

- Users can only select their own chat sessions
- Users can only insert chat sessions with their own user ID
- Users can only update their own chat sessions
- Users can only delete their own chat sessions
- Similar policies apply to chat messages

## Usage

The chat history feature is accessible from the sidebar. Users can:

1. View their chat history
2. Filter chat history by time
3. Delete chat sessions
4. Copy chat sessions to clipboard
5. Restore previous chat sessions

## Security

Row Level Security (RLS) policies are implemented to ensure that users can only access their own chat sessions and messages. The policies are defined in the `schema.sql` file.

## Troubleshooting

If you encounter issues with the Supabase integration:

1. Check that your environment variables are correctly set
2. Ensure the SQL schema has been properly executed in your Supabase instance
3. Verify that your Supabase project has Row Level Security enabled
4. Check the browser console for any error messages
5. Make sure your authentication system is properly configured

For more information, refer to the [Supabase documentation](https://supabase.com/docs).
