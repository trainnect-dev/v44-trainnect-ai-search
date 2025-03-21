import { createClient } from "@/utils/supabase/server-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  
  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }
  
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/", request.url));
}
