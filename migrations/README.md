# Database Migrations

This directory contains SQL migration files for the Supabase database.

## How to Run Migrations

You can run these migrations using the Supabase Dashboard SQL Editor or the Supabase CLI.

### Using Supabase Dashboard

1. Log in to your Supabase Dashboard
2. Go to the SQL Editor
3. Copy the contents of the migration file
4. Paste into the SQL Editor
5. Click "Run" to execute the migration

### Using Supabase CLI

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Log in to your Supabase account:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Run the migration:
   ```bash
   supabase db execute --file migrations/add_file_urls_to_chat_messages.sql
   ```

## Migration Files

- `add_file_urls_to_chat_messages.sql`: Adds a `file_urls` column to the `chat_messages` table to store URLs of files uploaded to Supabase Storage. Also creates storage policies for file access control.

- `setup_storage_rls.sql`: Sets up Row Level Security (RLS) policies for Supabase Storage, allowing authenticated users to upload, view, update, and delete their own files in the `chat-attachments` bucket. Also allows public access to files in the bucket.

## Storage Buckets

The application uses the following storage buckets:

- `chat-attachments`: Stores files uploaded in chat conversations

These buckets are created automatically when an authenticated user accesses the application.

## Troubleshooting

If you encounter RLS policy errors when uploading files, run the `setup_storage_rls.sql` migration to configure the proper security policies for the storage bucket.

Common errors:
- `StorageApiError: new row violates row-level security policy`: This indicates that the RLS policies are not properly configured. Run the `setup_storage_rls.sql` migration to fix this issue.

## Alternative Approach

If you prefer not to run SQL migrations, the application includes a server-side API route (`/api/storage/init`) that attempts to create the necessary storage bucket and configure it for public access. This route is called automatically when an authenticated user accesses the application.
