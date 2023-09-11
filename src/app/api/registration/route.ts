import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { data, willArrive } = await request.json();
  const event = await prisma.event.findFirstOrThrow({ where: { id: data.eventId }, select: { time: true } });

  if (event.time < new Date()) {
    return NextResponse.json({ message: `Det er ikke lov å lage en registrering etter at arrangementet har startet` }, { status: HttpStatusCode.FORBIDDEN });
  }

  const result = await prisma.registrations.create({
    data: {
      eventId: data.eventId,
      willArrive: willArrive,
      playerId: data.playerId,
      ...(data.reason && {
        reason: data.reason,
      }),
    },
  });
  return NextResponse.json(result);
};
