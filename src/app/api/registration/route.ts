import { EventType } from '@prisma/client';
import { getSignedInUserOrThrow } from 'functions/getUser';
import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { data, willArrive } = await request.json();
  const [user, event] = await Promise.all([
    getSignedInUserOrThrow(),
    prisma.event.findFirstOrThrow({ where: { id: data.eventId }, select: { eventType: true, time: true, id: true } }),
  ]);

  if (event.time < new Date()) {
    return NextResponse.json({ message: `Det er ikke lov å lage en registrering etter at arrangementet har startet` }, { status: HttpStatusCode.FORBIDDEN });
  }

  if (user.disableRegistrations && event.eventType !== EventType.SOCIAL) {
    return NextResponse.json({ message: `En administrator har deaktivert påmelding for deg` }, { status: HttpStatusCode.FORBIDDEN });
  }

  const result = await prisma.registrations.create({
    data: {
      eventId: event.id,
      willArrive: willArrive,
      playerId: user.id,
      ...(data.reason && {
        reason: data.reason,
      }),
    },
  });

  return NextResponse.json(result);
};
