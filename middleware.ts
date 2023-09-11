import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE_KEY } from 'values';

export const middleware = (request: NextRequest) => {
  const hasAuthToken = request.cookies.get(AUTH_TOKEN_COOKIE_KEY) !== undefined;

  if (!hasAuthToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/admin', '/admin/(.*)', '/api/((?!auth|refresh-players|ics).*)'],
};
