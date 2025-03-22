"use client";

import { useState } from "react";
import { uploadFile } from "@/utils/supabase/storage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TestFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadedUrl(null);

    try {
      // Initialize storage bucket first
      await fetch('/api/storage/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Upload the file
      const url = await uploadFile(file);
      setUploadedUrl(url);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Test File Upload</h2>
      
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-gray-50 file:text-gray-700
            hover:file:bg-gray-100"
          accept="image/*,application/pdf"
        />
      </div>
      
      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        className="mb-4"
      >
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
      
      {uploadedUrl && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Uploaded File:</h3>
          <div className="break-all bg-gray-50 p-2 rounded text-sm">{uploadedUrl}</div>
          
          {uploadedUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
            <div className="mt-4">
              <img 
                src={uploadedUrl} 
                alt="Uploaded file" 
                className="max-w-full h-auto max-h-64 rounded-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
