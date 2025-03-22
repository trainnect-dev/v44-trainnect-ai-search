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
