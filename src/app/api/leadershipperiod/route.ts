import { revalidateTag } from 'next/cache';

import { ALL_LEADERSHIP_PERIODS_CACHE_TAG } from '~/functions/getLeadershipPeriodsPlayers';

import { prismaClient } from '~/prismaClient';

export const POST = async (request: Request) => {
  const { data } = await request.json();

  const newPeriod = await prismaClient.leadershipPeriod.create({
    data: {
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    },
  });

  revalidateTag(ALL_LEADERSHIP_PERIODS_CACHE_TAG);

  return Response.json(newPeriod);
};
