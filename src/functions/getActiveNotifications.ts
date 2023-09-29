import 'server-only';

import { minutesToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { unstable_cache } from 'next/cache';

export const NOTIFICATIONS_CACHE_TAG = 'notifications';

export const getActiveNotifications = unstable_cache(
  async () => {
    return prisma.notification.findMany({
      where: { expiringDate: { gt: new Date() } },
      orderBy: { expiringDate: 'asc' },
      include: { author: true },
    });
  },
  undefined,
  {
    revalidate: minutesToSeconds(10),
    tags: [NOTIFICATIONS_CACHE_TAG],
  },
);
