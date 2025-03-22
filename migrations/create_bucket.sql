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
