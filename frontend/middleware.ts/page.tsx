import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(
  request: NextRequest,
) {
  const token =
    request.cookies.get(
      'token',
    )?.value;

  const pathname =
    request.nextUrl.pathname;

  const publicRoutes = [
    '/',
    '/register',
  ];

  const isPublicRoute =
    publicRoutes.includes(
      pathname,
    );

  // NOT LOGGED IN
  if (
    !token &&
    !isPublicRoute
  ) {
    return NextResponse.redirect(
      new URL(
        '/',
        request.url,
      ),
    );
  }

  // ALREADY LOGGED IN
  if (
    token &&
    isPublicRoute
  ) {
    return NextResponse.redirect(
      new URL(
        '/dashboard',
        request.url,
      ),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/sales/:path*',
    '/users/:path*',
    '/pos/:path*',
    '/',
    '/register',
  ],
};