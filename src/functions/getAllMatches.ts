import 'server-only';

import { EventType, Prisma } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { unstable_cache } from 'next/cache';

import { prismaClient } from '~/prismaClient';

export const ALL_MATCHES_CACHE_TAG = 'all-matches';

export const getAllMatches = unstable_cache(
  async (): Promise<Prisma.EventGetPayload<{ include: { team: true; match: true } }>[]> => {
    return prismaClient.event.findMany({
      include: {
        match: true,
        team: true,
      },
      where: {
        eventType: EventType.MATCH,
        time: { lte: new Date() },
      },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(60),
    tags: [ALL_MATCHES_CACHE_TAG],
  },
);
