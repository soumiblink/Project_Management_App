import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedPage = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/projects') || 
                          pathname.startsWith('/tasks') ||
                          pathname.startsWith('/account') ||
                          pathname.startsWith('/help');

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
    '/register'
  ],
};
