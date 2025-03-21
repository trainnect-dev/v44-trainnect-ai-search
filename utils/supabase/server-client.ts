'use server';

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  const cookieStore = await cookies(); // Await the cookies() call
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, any>) {
          // This is a readonly cookie store in a Server Component
          // We can't set cookies here, they will be handled by the middleware
        },
        remove(name: string, options: Record<string, any>) {
          // This is a readonly cookie store in a Server Component
          // We can't remove cookies here, they will be handled by the middleware
        },
      },
    }
  );
};
