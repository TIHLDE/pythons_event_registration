import { prismaClient } from '~/prismaClient';

export const GET = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = Number(params.id);
  const matchEvents = await prismaClient.matchEvent.findMany({
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
  return Response.json(matchEvents);
};

export const POST = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = Number(params.id);
  const matchEvent = await prismaClient.matchEvent.create({
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
  return Response.json(matchEvent);
};
