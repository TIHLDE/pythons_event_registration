import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = Number(params.id);
  const matchEvents = await prisma.matchEvent.findMany({
    where: {
      matchId: parsedId,
    },
    include: {
      player: true,
    },
    orderBy: {
      type: 'asc',
    },
  });
  return NextResponse.json(matchEvents);
};

export const POST = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = Number(params.id);
  const matchEvent = await prisma.matchEvent.create({
    data: {
      type: data.type,
      match: {
        connect: {
          id: parsedId,
        },
      },
      player: {
        connect: {
          id: data.playerId,
        },
      },
    },
  });
  return NextResponse.json(matchEvent);
};
