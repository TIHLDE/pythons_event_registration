import { hoursToSeconds } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

import { completeLogin } from '~/tihlde/auth';

import { AUTH_TOKEN_COOKIE_KEY, PHOTON_ISSUER, USER_STORAGE_KEY } from '~/values';

export const dynamic = 'force-dynamic';

const OAUTH_STATE = 'pythons-oauth-state';

const deny = (request: NextRequest, message: string) => {
  const url = new URL('/login', request.url);
  url.searchParams.set('error', message);
  return NextResponse.redirect(url);
};

export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const stored = request.cookies.get(OAUTH_STATE)?.value;
  const [expectedState, redirectUrl = '/'] = (stored ?? '').split('|');

  if (!code) return deny(request, 'Innloggingen ble avbrutt. Prøv igjen.');
  if (!state || !expectedState || state !== expectedState) {
    return deny(request, 'Innloggingen ble avbrutt. Prøv igjen.');
  }

  const redirectUri = new URL('/api/auth/callback', request.url).toString();

  const tokenResponse = await fetch(`${PHOTON_ISSUER}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: process.env.PHOTON_CLIENT_ID ?? '',
      client_secret: process.env.PHOTON_CLIENT_SECRET ?? '',
    }).toString(),
  });

  if (!tokenResponse.ok) {
    return deny(request, 'Kunne ikke fullføre innloggingen. Prøv igjen senere.');
  }

  const tokens = (await tokenResponse.json()) as { access_token: string; expires_in?: number };

  const sessionResponse = await fetch(`${PHOTON_ISSUER}/get-session`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
    cache: 'no-store',
  });

  if (!sessionResponse.ok) {
    return deny(request, 'Kunne ikke hente brukerdata fra TIHLDE.');
  }

  const session = (await sessionResponse.json()) as {
    user?: { id: string; name?: string | null; username?: string | null };
  };
  const username = session.user?.username ?? session.user?.id;
  if (!username) return deny(request, 'Kunne ikke hente brukerdata fra TIHLDE.');

  let player;
  try {
    // Tokenet sendes inn, ikke leses fra cookien: den settes på responsen
    // under og er ikke lesbar i denne forespørselen.
    player = await completeLogin(username, session.user?.name ?? '', tokens.access_token);
  } catch (e) {
    return deny(request, (e as Error).message);
  }

  const response = NextResponse.redirect(new URL(redirectUrl, request.url));

  response.cookies.set(USER_STORAGE_KEY, JSON.stringify(player), {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: hoursToSeconds(24) * 180,
  });
  response.cookies.set(AUTH_TOKEN_COOKIE_KEY, tokens.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: hoursToSeconds(24) * 180,
  });
  response.cookies.delete(OAUTH_STATE);

  return response;
};
