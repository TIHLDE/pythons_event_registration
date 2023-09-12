import 'server-only';

import { EventType } from '@prisma/client';
import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { cache } from 'react';

export const revalidate = minutesToSeconds(10);

export const getEventTypes = cache(async (): Promise<EventType[]> => {
  return await prisma.eventType.findMany();
});
