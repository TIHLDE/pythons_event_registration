import HttpStatusCode from 'http-status-typed';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { syncPlayers } from '~/functions/syncPlayers';

import { AUTH_TOKEN_COOKIE_KEY } from '~/values';

const authTokenSchema = z.object({
  authToken: z.string({ required_error: '"authToken" is missing in request-body' }).trim().min(0),
});

export const POST = async (request: Request) => {
  const body = await request.json();
  const result = authTokenSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: result.error }, { status: HttpStatusCode.BAD_REQUEST });
  }
  cookies().set(AUTH_TOKEN_COOKIE_KEY, result.data.authToken);

  const response = await syncPlayers();
  return Response.json(response, { status: response.ok ? HttpStatusCode.OK : HttpStatusCode.INTERNAL_SERVER_ERROR });
};
