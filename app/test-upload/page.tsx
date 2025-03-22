import { TestFileUpload } from "@/components/test-file-upload";
import { createClient } from "@/utils/supabase/server-client";

export default async function TestUploadPage() {
  // Create Supabase client
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">File Upload Test</h1>
      
      {isAuthenticated ? (
        <TestFileUpload />
      ) : (
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md">
          <p className="text-yellow-800">
            You need to be logged in to test file uploads. Please <a href="/auth/login" className="underline font-semibold">log in</a> first.
          </p>
        </div>
      )}
    </div>
  );
}
