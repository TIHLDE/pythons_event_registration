import HttpStatusCode from 'http-status-typed';
import { NextResponse } from 'next/server';
import { authenticate } from 'tihlde/auth';

export const POST = async (request: Request) => {
  const { user_id, password } = await request.json();
  try {
    await authenticate({ user_id, password });
    return NextResponse.json({});
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: HttpStatusCode.BAD_REQUEST });
  }
};
