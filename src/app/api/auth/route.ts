import HttpStatusCode from 'http-status-typed';

import { authenticate } from '~/tihlde/auth';

export const POST = async (request: Request) => {
  const { user_id, password } = await request.json();
  try {
    await authenticate({ user_id, password });
    return Response.json({});
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: HttpStatusCode.BAD_REQUEST });
  }
};
