import { EventType } from '@prisma/client';

import { prismaClient } from '~/prismaClient';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const players = await prismaClient.event.findMany();
  return Response.json(players);
};

export const POST = async (request: Request) => {
  const { data } = await request.json();
  await prismaClient.event.create({
    data: {
      location: data.location,
      time: new Date(data.time),
      eventType: data.eventType,
      description: data.description,
      ...(data.title &&
        data.eventType !== EventType.TRAINING && {
          title: data.title,
        }),
      ...(data.team &&
        data.eventType === EventType.MATCH && {
          teamId: Number(data.team),
          match: {
            create: {
              homeGoals: 0,
              awayGoals: 0,
              team: {
                connect: {
                  id: Number(data.team),
                },
              },
            },
          },
        }),
    },
  });
  return Response.json({});
};
