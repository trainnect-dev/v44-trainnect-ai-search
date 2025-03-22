-- Add file_urls column to chat_messages table
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS file_urls TEXT[];

-- Create policy to allow users to access their own files
BEGIN;
  -- Check if the storage.objects table exists
  DO $$
  BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
      -- Create policy for reading files (if it doesn't exist)
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow users to read their own files'
      ) THEN
        CREATE POLICY "Allow users to read their own files" 
        ON storage.objects 
        FOR SELECT 
        USING (auth.uid() = owner);
      END IF;
      
      -- Create policy for inserting files (if it doesn't exist)
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow users to upload files'
      ) THEN
        CREATE POLICY "Allow users to upload files" 
        ON storage.objects 
        FOR INSERT 
        WITH CHECK (auth.uid() = owner);
      END IF;
      
      -- Create policy for deleting files (if it doesn't exist)
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Allow users to delete their own files'
      ) THEN
        CREATE POLICY "Allow users to delete their own files" 
        ON storage.objects 
        FOR DELETE 
        USING (auth.uid() = owner);
      END IF;
    END IF;
  END
  $$;
COMMIT;
