/**
 * PKCE-hjelpere.
 *
 * Photon krever PKCE av alle klienter, også konfidensielle der hemmeligheten
 * ligger trygt på serveren. Verifieren lagres i en httpOnly-cookie og sendes
 * først ved kodevekslingen; det som går til Photon i autorisasjonssteget er en
 * SHA-256 av den, så koden alene er ubrukelig.
 */
function base64url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i] as number);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function createVerifier(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64url(new Uint8Array(digest));
}
