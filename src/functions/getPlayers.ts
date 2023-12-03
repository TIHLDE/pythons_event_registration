import 'server-only';

import { Player } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { unstable_cache } from 'next/cache';

import { prismaClient } from '~/prismaClient';

export const PLAYERS_CACHE_TAG = 'players';

export const getPlayer = unstable_cache(
  async (id: number): Promise<Player | null> => {
    return await prismaClient.player.findFirst({ where: { id }, include: { team: true } });
  },
  undefined,
  {
    revalidate: minutesToSeconds(10),
    tags: [PLAYERS_CACHE_TAG],
  },
);

export const getPlayers = unstable_cache(
  async (): Promise<Player[]> => {
    return prismaClient.player.findMany({
      where: {
        active: true,
      },
      orderBy: { name: 'asc' },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(10),
    tags: [PLAYERS_CACHE_TAG],
  },
);
