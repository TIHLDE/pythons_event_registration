import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// eslint-disable-next-line no-restricted-imports
import { AUTH_TOKEN_COOKIE_KEY } from './src/values';

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
