import { NextRequest, NextResponse } from 'next/server';

import { challengeFor, createVerifier } from '~/tihlde/pkce';

import { PHOTON_ISSUER } from '~/values';

export const dynamic = 'force-dynamic';

const OAUTH_STATE = 'pythons-oauth-state';

/**
 * Sender brukeren til Photon. Passordet skrives inn på tihlde.org, ikke her.
 */
export const GET = async (request: NextRequest) => {
  const clientId = process.env.PHOTON_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'PHOTON_CLIENT_ID er ikke satt' }, { status: 500 });
  }

  const redirectUri = new URL('/api/auth/callback', request.url).toString();

  // State binder callbacken til nettleseren som startet flyten.
  const state = crypto.randomUUID();

  // Photon avviser autorisasjon uten PKCE — «pkce is required for this
  // client» — også for konfidensielle klienter som denne. Verifieren blir
  // liggende i cookien og sendes først ved kodevekslingen.
  const verifier = createVerifier();
  const redirectUrl = request.nextUrl.searchParams.get('redirect_url') ?? '/';

  const authorizeUrl = new URL(`${PHOTON_ISSUER}/oauth2/authorize`);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'openid profile email');
  authorizeUrl.searchParams.set('state', state);
  authorizeUrl.searchParams.set('code_challenge', await challengeFor(verifier));
  authorizeUrl.searchParams.set('code_challenge_method', 'S256');

  const response = NextResponse.redirect(authorizeUrl.toString());
  response.cookies.set(OAUTH_STATE, `${state}|${verifier}|${redirectUrl}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  });
  return response;
};
