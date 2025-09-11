import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard'];
const authRoutes = ['/auth/signin', '/auth/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get access token from cookie
  const accessToken = request.cookies.get('access-token')?.value;
  
  // For protected routes, check authentication
  if (isProtectedRoute) {
    if (!accessToken) {
      // Redirect to signin with return URL
      const signinUrl = new URL('/auth/signin', request.url);
      signinUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(signinUrl);
    }
    
    // Check if user is verified by calling the API
    // Note: In production, you might want to verify the JWT directly here
    // For now, we'll trust that the API routes handle verification
    return NextResponse.next();
  }
  
  // For auth routes, redirect to dashboard if already authenticated
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
