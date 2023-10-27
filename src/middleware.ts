import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { AUTH_TOKEN_COOKIE_KEY } from '~/values';

export const middleware = (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/refresh-players') || pathname.startsWith('/api/ics')) {
    return NextResponse.next();
  }

  const hasAuthToken = request.cookies.get(AUTH_TOKEN_COOKIE_KEY) !== undefined;

  if (!hasAuthToken && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL(`/login?redirect_url=${pathname}`, request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!public|_next/static|_next/image|favicon.ico).*)'],
};
