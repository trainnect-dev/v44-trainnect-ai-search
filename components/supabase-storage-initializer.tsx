"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function SupabaseStorageInitializer() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        if (isInitialized || hasAttempted) return;
        
        setHasAttempted(true);
        
        const response = await fetch('/api/storage/init', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Failed to initialize storage:', data.error);
          // Don't show error toast to user - just log it
          // The bucket might already exist or be created by the SQL migration
        } else {
          console.log('Supabase Storage initialized successfully:', data.message);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Error initializing Supabase Storage:', error);
        // Don't block the application if storage initialization fails
        // The user can still use the chat functionality
      }
    };

    initializeStorage();
  }, [isInitialized, hasAttempted]);

  // This component doesn't render anything
  return null;
}
