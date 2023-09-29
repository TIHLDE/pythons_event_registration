import 'server-only';

import { EventType, Prisma } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { unstable_cache } from 'next/cache';

export const ALL_MATCHES_CACHE_TAG = 'all-matches';

export const getAllMatches = unstable_cache(
  async (): Promise<Prisma.EventGetPayload<{ include: { team: true; match: true } }>[]> => {
    return prisma.event.findMany({
      include: {
        match: true,
        team: true,
      },
      where: {
        eventType: EventType.MATCH,
      },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(60),
    tags: [ALL_MATCHES_CACHE_TAG],
  },
);
