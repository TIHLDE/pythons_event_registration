import 'server-only';

import { Team } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { unstable_cache } from 'next/cache';

export const TEAMS_CACHE_TAG = 'teams';

export const getTeams = unstable_cache(
  async (): Promise<Team[]> => {
    return await prisma.team.findMany();
  },
  undefined,
  {
    revalidate: minutesToSeconds(60),
    tags: [TEAMS_CACHE_TAG],
  },
);
