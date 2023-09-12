import 'server-only';

import { Position } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { cache } from 'react';

export const revalidate = minutesToSeconds(10);

export const getPositions = cache(async (): Promise<Position[]> => {
  return await prisma.position.findMany();
});
