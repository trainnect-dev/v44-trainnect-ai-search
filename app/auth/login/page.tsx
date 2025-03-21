import { LoginForm } from "@/components/auth/login-form";
import { createClient } from "@/utils/supabase/server-client";
import { NextResponse } from "next/server";

export default async function LoginPage() {
  const supabase = await createClient();
  
  // Check if user is already logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  // If there is a session, redirect to the home page
  if (session) {
    return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
