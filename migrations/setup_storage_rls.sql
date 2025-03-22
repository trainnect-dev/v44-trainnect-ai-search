-- This migration sets up Row Level Security (RLS) policies for Supabase Storage
-- Run this in the Supabase SQL Editor

-- Add file_urls column to chat_messages table if it doesn't exist
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_urls TEXT[];

-- Enable Row Level Security on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow users to upload files'
  ) THEN
    CREATE POLICY "Allow users to upload files" 
    ON storage.objects 
    FOR INSERT 
    TO authenticated
    WITH CHECK (bucket_id = 'chat-attachments');
  END IF;
END
$$;

-- Create policy to allow authenticated users to select their own objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow users to view their own files'
  ) THEN
    CREATE POLICY "Allow users to view their own files" 
    ON storage.objects 
    FOR SELECT 
    TO authenticated
    USING (bucket_id = 'chat-attachments' AND (auth.uid() = owner OR owner IS NULL));
  END IF;
END
$$;

-- Create policy to allow authenticated users to update their own objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow users to update their own files'
  ) THEN
    CREATE POLICY "Allow users to update their own files" 
    ON storage.objects 
    FOR UPDATE 
    TO authenticated
    USING (bucket_id = 'chat-attachments' AND auth.uid() = owner)
    WITH CHECK (bucket_id = 'chat-attachments');
  END IF;
END
$$;

-- Create policy to allow authenticated users to delete their own objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow users to delete their own files'
  ) THEN
    CREATE POLICY "Allow users to delete their own files" 
    ON storage.objects 
    FOR DELETE 
    TO authenticated
    USING (bucket_id = 'chat-attachments' AND auth.uid() = owner);
  END IF;
END
$$;

-- Create policy to allow public access to objects in the chat-attachments bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow public access to chat attachments'
  ) THEN
    CREATE POLICY "Allow public access to chat attachments" 
    ON storage.objects 
    FOR SELECT 
    TO anon
    USING (bucket_id = 'chat-attachments');
  END IF;
END
$$;

-- Create the chat-attachments bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'chat-attachments'
  ) THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
    VALUES ('chat-attachments', 'chat-attachments', true, false, 10485760, ARRAY['image/*', 'application/pdf']);
  END IF;
END
$$;
