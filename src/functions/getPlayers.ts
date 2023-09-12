import 'server-only';

import { Player } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { cache } from 'react';

export const revalidate = minutesToSeconds(10);

export const getPlayer = cache(async (id: number): Promise<Player | null> => {
  return await prisma.player.findFirst({ where: { id }, include: { team: true } });
});

export const getPlayers = cache(async (): Promise<Player[]> => {
  return prisma.player.findMany({
    where: {
      active: true,
    },
    orderBy: { name: 'asc' },
  });
});
