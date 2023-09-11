import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const players = await prisma.event.findMany();
  return NextResponse.json(players);
};

export const POST = async (request: Request) => {
  const { data } = await request.json();
  await prisma.event.create({
    data: {
      location: data.location,
      time: new Date(data.time),
      eventTypeSlug: data.eventTypeSlug,
      ...(data.title &&
        data.eventTypeSlug !== 'trening' && {
          title: data.title,
        }),
      ...(data.team &&
        data.eventTypeSlug === 'kamp' && {
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
  return NextResponse.json({});
};
