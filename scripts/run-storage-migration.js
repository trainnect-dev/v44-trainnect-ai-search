#!/usr/bin/env node

/**
 * This script helps run the storage migration SQL file directly.
 * It reads the SQL file and outputs it in a format that can be easily copied
 * and pasted into the Supabase SQL Editor.
 */

const fs = require('fs');
const path = require('path');

// Path to the SQL migration file
const migrationFilePath = path.join(__dirname, '..', 'migrations', 'setup_storage_rls.sql');

// Fixed SQL for creating the bucket
const fixedBucketCreationSQL = `
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
`;

try {
  // Read the SQL file
  let sqlContent = fs.readFileSync(migrationFilePath, 'utf8');
  
  // Replace the bucket creation part with the fixed version
  const bucketCreationRegex = /-- Create the chat-attachments bucket[\s\S]*?END\s*\$\$;/;
  sqlContent = sqlContent.replace(bucketCreationRegex, fixedBucketCreationSQL.trim());
  
  console.log('='.repeat(80));
  console.log('STORAGE MIGRATION SQL');
  console.log('='.repeat(80));
  console.log('\nCopy and paste the following SQL into the Supabase SQL Editor:\n');
  console.log(sqlContent);
  console.log('\n');
  console.log('='.repeat(80));
  console.log('INSTRUCTIONS:');
  console.log('1. Go to the Supabase Dashboard');
  console.log('2. Click on "SQL Editor" in the left sidebar');
  console.log('3. Create a new query');
  console.log('4. Paste the SQL above into the editor');
  console.log('5. Click "Run" to execute the migration');
  console.log('='.repeat(80));
} catch (error) {
  console.error('Error reading migration file:', error);
  process.exit(1);
}
