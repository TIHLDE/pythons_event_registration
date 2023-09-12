import 'server-only';

import { Team } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { cache } from 'react';

export const revalidate = minutesToSeconds(10);

export const getTeams = cache(async (): Promise<Team[]> => {
  return await prisma.team.findMany();
});
