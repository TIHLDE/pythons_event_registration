import 'server-only';

import { Player } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { cache } from 'react';

export const revalidate = minutesToSeconds(10);

export const getPlayer = cache(async (id: number): Promise<Player | null> => {
  const player = await prisma.player.findFirst({ where: { id }, include: { team: true } });
  return player;
});
