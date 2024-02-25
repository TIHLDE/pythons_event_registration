import { revalidateTag } from 'next/cache';

import { ALL_LEADERSHIP_PERIODS_CACHE_TAG } from '~/functions/getLeadershipPeriodsPlayers';

import { prismaClient } from '~/prismaClient';

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = Number(params.id);
  const player = await prismaClient.leadershipPeriodRole.update({
    where: {
      id: parsedId,
    },
    data,
  });
  revalidateTag(ALL_LEADERSHIP_PERIODS_CACHE_TAG);
  return Response.json(player);
};

export const DELETE = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = parseInt(params.id);
  await prismaClient.leadershipPeriodRole.delete({
    where: {
      id: parsedId,
    },
  });

  revalidateTag(ALL_LEADERSHIP_PERIODS_CACHE_TAG);

  return Response.json({});
};
