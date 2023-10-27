import 'server-only';

import { minutesToSeconds } from 'date-fns';
import { unstable_cache } from 'next/cache';

import { prisma } from '~/lib/prisma';

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
