import 'server-only';

import { Team } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { unstable_cache } from 'next/cache';

import { prismaClient } from '~/prismaClient';

export const TEAMS_CACHE_TAG = 'teams';

export const getTeams = unstable_cache(
  async (): Promise<Team[]> => {
    return await prismaClient.team.findMany();
  },
  undefined,
  {
    revalidate: minutesToSeconds(60),
    tags: [TEAMS_CACHE_TAG],
  },
);
