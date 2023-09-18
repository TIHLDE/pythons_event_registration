import 'server-only';

import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { cache } from 'react';

export const revalidate = minutesToSeconds(0.5);

export const getActiveNotifications = cache(async () => {
  return prisma.notification.findMany({
    where: { expiringDate: { gt: new Date() } },
    orderBy: { expiringDate: 'asc' },
    include: { author: true },
  });
});
