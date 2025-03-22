import { createClient } from "@/utils/supabase/server-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const bucketName = 'chat-attachments';
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return NextResponse.json(
        { error: `Failed to list buckets: ${listError.message}` },
        { status: 500 }
      );
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Instead of creating the bucket here, inform the client that the bucket doesn't exist
      // The bucket should be created through SQL migrations
      console.log('Bucket does not exist. It should be created through SQL migrations.');
      return NextResponse.json(
        { 
          warning: `Bucket '${bucketName}' does not exist. Please run the SQL migrations to create it.`,
          success: false
        },
        { status: 200 }
      );
    }
    
    // Test file upload to verify permissions
    try {
      // Create a test file to verify permissions
      const testContent = 'This is a test file to verify storage permissions.';
      const testFile = new Blob([testContent], { type: 'text/plain' });
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload('test-permissions.txt', testFile, {
          upsert: true
        });
        
      if (uploadError) {
        console.error('Error uploading test file:', uploadError);
        return NextResponse.json(
          { 
            warning: `Failed to upload test file: ${uploadError.message}`,
            success: true,
            message: `Storage bucket '${bucketName}' exists but there might be permission issues`
          },
          { status: 200 }
        );
      }
      
      // Get the public URL of the test file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl('test-permissions.txt');
      
      return NextResponse.json({
        success: true,
        message: `Storage bucket '${bucketName}' is ready`,
        testFileUrl: publicUrl
      });
    } catch (uploadTestError) {
      console.error('Error testing bucket permissions:', uploadTestError);
      return NextResponse.json({
        success: true,
        warning: `Bucket exists but there might be permission issues: ${uploadTestError instanceof Error ? uploadTestError.message : String(uploadTestError)}`,
        message: `Storage bucket '${bucketName}' exists`
      });
    }
    
  } catch (error) {
    console.error('Error initializing storage:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { error: `Failed to initialize storage: ${errorMessage}` },
      { status: 500 }
    );
  }
}
