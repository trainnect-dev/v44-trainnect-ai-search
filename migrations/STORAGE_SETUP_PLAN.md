# Supabase Storage Setup Plan

This document outlines the step-by-step process to correctly set up Supabase Storage with Row Level Security (RLS) policies for the chat application.

## Problem

We encountered issues with the storage bucket creation and RLS policies, resulting in errors when trying to upload files in the chat application.

## Solution

Follow these steps in order to properly set up Supabase Storage:

### Step 1: Create the Storage Bucket

1. Go to the Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the following SQL:

```sql
-- Create the chat-attachments bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'chat-attachments'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
    VALUES ('chat-attachments', 'chat-attachments', true, false, 10485760, ARRAY['image/*', 'application/pdf']::text[]);
  END IF;
END
$$;
```

5. Click "Run" to execute the query
6. Verify in the Supabase Storage section that the 'chat-attachments' bucket has been created

### Step 2: Set Up Row Level Security Policies

1. Stay in the SQL Editor or create a new query
2. Copy and paste the following SQL:

```sql
-- Add file_urls column to chat_messages table if it doesn't exist
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_urls TEXT[];

-- Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to chat attachments" ON storage.objects;

-- Create policy to allow authenticated users to insert objects
CREATE POLICY "Allow users to upload files" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'chat-attachments');

-- Create policy to allow authenticated users to select their own objects
CREATE POLICY "Allow users to view their own files" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'chat-attachments' AND (auth.uid() = owner OR owner IS NULL));

-- Create policy to allow authenticated users to update their own objects
CREATE POLICY "Allow users to update their own files" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'chat-attachments' AND auth.uid() = owner)
WITH CHECK (bucket_id = 'chat-attachments');

-- Create policy to allow authenticated users to delete their own objects
CREATE POLICY "Allow users to delete their own files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'chat-attachments' AND auth.uid() = owner);

-- Create policy to allow public access to objects in the chat-attachments bucket
CREATE POLICY "Allow public access to chat attachments" 
ON storage.objects 
FOR SELECT 
TO anon
USING (bucket_id = 'chat-attachments');

```

3. Click "Run" to execute the query
4. Verify in the Supabase Auth > Policies section that the RLS policies have been created for the storage.objects table

### Step 3: Verify the Setup

1. Go to the Supabase Storage section
2. Click on the 'chat-attachments' bucket
3. Try to upload a test file manually to verify that the bucket is working
4. Check that the RLS policies are applied by viewing the policies in the Auth > Policies section

### Step 4: Test in the Application

1. Restart the application if it's running
2. Log in to the application
3. Navigate to the chat interface
4. Try to upload a file in a chat message
5. Verify that the file is uploaded successfully and appears in the chat

## Troubleshooting

If you encounter issues:

1. **Policy Already Exists Error**: If you get an error saying a policy already exists, you can modify the SQL to drop the existing policy first:

```sql
DROP POLICY IF EXISTS "Policy Name" ON storage.objects;
```

2. **Bucket Already Exists Error**: If the bucket already exists but has incorrect settings, you can drop it first:

```sql
DROP BUCKET IF EXISTS "chat-attachments";
```

3. **Permission Issues**: Ensure that the authenticated user has the correct permissions by checking the RLS policies.

## Files Reference

- `create_bucket.sql`: Contains the SQL to create the storage bucket
- `setup_rls_policies.sql`: Contains the SQL to set up the RLS policies
- `setup_storage_rls.sql`: Original migration file (not recommended to use due to syntax issues)

## Next Steps After Successful Setup

Once the storage is set up correctly:

1. Update the application to display uploaded files in the chat interface
2. Add functionality to download files from Supabase Storage
3. Consider adding file type validation and size restrictions in the frontend

## Important Notes

- The bucket is set to be public, which means anyone with the URL can access the files
- File size is limited to 10MB
- Only image files and PDFs are allowed to be uploaded
