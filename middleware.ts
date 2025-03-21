import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = updateSession(request);
    
    // Get the pathname from the URL
    const { pathname } = request.nextUrl;
    
    // Skip middleware for static assets and API routes
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('favicon.ico') ||
      pathname.includes('.png') ||
      pathname.includes('.jpg') ||
      pathname.includes('.svg')
    ) {
      return response;
    }
    
    // Refresh session if expired - required for Server Components
    const { data: { session } } = await supabase.auth.getSession();
    
    // Check if the user is authenticated
    if (!session) {
      // If the user is not authenticated and trying to access a protected route
      if (
        pathname !== '/auth/login' && 
        pathname !== '/auth/signup' &&
        pathname !== '/auth/callback'
      ) {
        // Redirect to login page
        const redirectUrl = new URL('/auth/login', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    } else {
      // If the user is authenticated and trying to access auth pages
      if (pathname === '/auth/login' || pathname === '/auth/signup') {
        // Redirect to home page
        const redirectUrl = new URL('/', request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }
    
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
