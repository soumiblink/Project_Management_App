import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  // Allow API routes to pass through
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow logout page to always be accessible
  if (pathname === '/logout') {
    return NextResponse.next();
  }

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isProtectedPage = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/projects') || 
                          pathname.startsWith('/tasks') ||
                          pathname.startsWith('/account') ||
                          pathname.startsWith('/help');

  // Redirect to login if accessing protected page without token
  if (isProtectedPage && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth page with valid token
  if (isAuthPage && token) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/projects/:path*', 
    '/tasks/:path*',
    '/account/:path*',
    '/help/:path*',
    '/login', 
    '/register',
    '/logout'
  ],
};
