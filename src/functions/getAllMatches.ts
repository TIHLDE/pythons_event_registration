import 'server-only';

import { EventType, Prisma } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { cache } from 'react';

export const revalidate = minutesToSeconds(60);

export const getAllMatches = cache(async (): Promise<Prisma.EventGetPayload<{ include: { team: true; match: true } }>[]> => {
  return prisma.event.findMany({
    include: {
      match: true,
      team: true,
    },
    where: {
      eventType: EventType.MATCH,
    },
  });
});
