import 'server-only';

import { Prisma } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { cache } from 'react';

export const revalidate = minutesToSeconds(60);

export const getAllMatches = cache(async (): Promise<Prisma.EventGetPayload<{ include: { type: true; team: true; match: true } }>[]> => {
  return prisma.event.findMany({
    include: {
      match: true,
      team: true,
      type: true,
    },
    where: {
      eventTypeSlug: 'kamp',
    },
  });
});
