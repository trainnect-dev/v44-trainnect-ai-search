import { createServerClient } from "@supabase/ssr";
import { cookies, RequestCookies } from "next/headers"; // Import RequestCookies

export const createClient = (cookieStore: RequestCookies) => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, any>) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: Record<string, any>) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );
};

// Example of how to call createClient
export const initializeClient = async () => {
  const cookieStore = await cookies(); // Await the cookies() call
  return createClient(cookieStore); // Pass the resolved cookieStore
};
