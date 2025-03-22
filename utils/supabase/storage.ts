import { createClient } from "./client";

/**
 * Uploads a file to Supabase Storage
 * @param file The file to upload
 * @param bucket The bucket name to upload to
 * @param path Optional path within the bucket
 * @returns The URL of the uploaded file
 */
export async function uploadFile(file: File, bucket: string = 'chat-attachments', path?: string): Promise<string> {
  const supabase = createClient();
  
  // Create a unique file path if not provided
  const filePath = path || `${Date.now()}-${file.name}`;
  
  try {
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to overwrite if file exists
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param path The path of the file to delete
 * @param bucket The bucket name containing the file
 */
export async function deleteFile(path: string, bucket: string = 'chat-attachments'): Promise<void> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
    throw error;
  }
}

/**
 * Gets the public URL for a file in Supabase Storage
 * @param path The path of the file
 * @param bucket The bucket name containing the file
 * @returns The public URL of the file
 */
export function getPublicUrl(path: string, bucket: string = 'chat-attachments'): string {
  const supabase = createClient();
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return publicUrl;
}
