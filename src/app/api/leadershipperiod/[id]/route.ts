import { revalidateTag } from 'next/cache';

import { ALL_LEADERSHIP_PERIODS_CACHE_TAG } from '~/functions/getLeadershipPeriodsPlayers';

import { prismaClient } from '~/prismaClient';

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = Number(params.id);
  const period = await prismaClient.leadershipPeriod.update({
    where: {
      id: parsedId,
    },
    data,
  });
  revalidateTag(ALL_LEADERSHIP_PERIODS_CACHE_TAG);
  return Response.json(period);
};

export const DELETE = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = parseInt(params.id);
  await prismaClient.leadershipPeriod.delete({
    where: {
      id: parsedId,
    },
  });

  revalidateTag(ALL_LEADERSHIP_PERIODS_CACHE_TAG);

  return Response.json({});
};
