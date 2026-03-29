import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public and private route boundaries
const publicRoutes = ['/login', '/signup'];
const privateRoutePrefixes = ['/app', '/integrations', '/routing', '/workflows', '/contacts', '/analytics', '/upgrade', '/admin', '/getting-started'];

export default function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  const accessToken = request.cookies.get('accessToken')?.value;
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutePrefixes.some(prefix => pathname.startsWith(prefix));

  // Accessing a private route without authentication
  if (isPrivateRoute && !accessToken) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Accessing an auth page while already authenticated
  if (isPublicRoute && accessToken) {
    url.pathname = '/app/scheduling/meeting_types/user/me';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Execute proxy on all paths except static assets, images, and root metadata
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
