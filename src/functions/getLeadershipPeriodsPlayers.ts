import 'server-only';

import { Prisma } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { unstable_cache } from 'next/cache';

import { prismaClient } from '~/prismaClient';

export const ALL_LEADERSHIP_PERIODS_CACHE_TAG = 'all-leadership-periods-players';

export type LeadershipPeriodWithDetails = Prisma.LeadershipPeriodGetPayload<{
  include: {
    leadershipPeriodRole: {
      include: {
        player: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>;

export const getLeadershipPeriodsPlayers = unstable_cache(
  async (): Promise<LeadershipPeriodWithDetails[]> => {
    return prismaClient.leadershipPeriod.findMany({
      orderBy: { startDate: 'desc' },
      include: {
        leadershipPeriodRole: {
          include: {
            player: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(60),
    tags: [ALL_LEADERSHIP_PERIODS_CACHE_TAG],
  },
);
