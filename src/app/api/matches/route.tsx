import { EventType } from '@prisma/client';
import { prisma } from 'lib/prisma';

export const POST = async (request: Request) => {
  const data = await request.json();
  const eventId = Number(data.eventId);

  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
      eventType: EventType.MATCH,
      match: null,
      teamId: { not: null },
    },
  });

  if (!event || event.matchId !== null || event.teamId === null) {
    return Response.json({ error: 'No events with the given ID which does not have a connected match' }, { status: 400 });
  }

  const match = await prisma.match.create({
    data: {
      homeGoals: 0,
      awayGoals: 0,
      team: {
        connect: {
          id: event.teamId,
        },
      },
      event: {
        connect: {
          id: event.id,
        },
      },
    },
  });
  return Response.json(match);
};
