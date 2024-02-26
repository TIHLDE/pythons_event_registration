import { revalidateTag } from 'next/cache';

import { ALL_LEADERSHIP_PERIODS_CACHE_TAG } from '~/functions/getLeadershipPeriodsPlayers';

import { prismaClient } from '~/prismaClient';

export const POST = async (request: Request) => {
  const { data } = await request.json();

  const newPeriodRole = await prismaClient.leadershipPeriodRole.create({
    data: {
      role: data.role,
      periodId: data.periodId,
      playerId: data.playerId,
    },
  });

  revalidateTag(ALL_LEADERSHIP_PERIODS_CACHE_TAG);

  return Response.json(newPeriodRole);
};
