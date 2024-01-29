import { EventType } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';

import { getSignedInUserOrThrow } from '~/functions/getUser';

import { prismaClient } from '~/prismaClient';

export const POST = async (request: Request) => {
  const { data, willArrive } = await request.json();
  const [user, event] = await Promise.all([
    getSignedInUserOrThrow(),
    prismaClient.event.findFirstOrThrow({ where: { id: data.eventId }, select: { eventType: true, time: true, id: true } }),
  ]);

  if (event.time < new Date()) {
    return Response.json({ message: `Det er ikke lov å lage en registrering etter at arrangementet har startet` }, { status: HttpStatusCode.FORBIDDEN });
  }

  if (user.disableRegistrations && event.eventType !== EventType.SOCIAL) {
    return Response.json({ message: `En administrator har deaktivert påmelding for deg` }, { status: HttpStatusCode.FORBIDDEN });
  }

  const result = await prismaClient.registrations.create({
    data: {
      eventId: event.id,
      willArrive: willArrive,
      playerId: user.id,
      ...(data.reason && {
        reason: data.reason,
      }),
    },
  });

  return Response.json(result);
};
