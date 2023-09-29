import 'server-only';

import { Player } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { unstable_cache } from 'next/cache';

export const PLAYERS_CACHE_TAG = 'players';

export const getPlayer = unstable_cache(
  async (id: number): Promise<Player | null> => {
    return await prisma.player.findFirst({ where: { id }, include: { team: true } });
  },
  undefined,
  {
    revalidate: minutesToSeconds(10),
    tags: [PLAYERS_CACHE_TAG],
  },
);

export const getPlayers = unstable_cache(
  async (): Promise<Player[]> => {
    return prisma.player.findMany({
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
