import { revalidateTag } from 'next/cache';

import { PLAYERS_CACHE_TAG } from '~/functions/getPlayers';
import { prismaClient } from '~/prismaClient';

export const GET = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = Number(params.id);
  const player = await prismaClient.player.findFirst({ where: { id: parsedId }, include: { team: true } });
  return Response.json(player);
};

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = Number(params.id);
  const player = await prismaClient.player.update({
    where: {
      id: parsedId,
    },
    data,
  });
  revalidateTag(PLAYERS_CACHE_TAG);
  return Response.json(player);
};
