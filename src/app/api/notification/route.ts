import { revalidateTag } from 'next/cache';

import { NOTIFICATIONS_CACHE_TAG } from '~/functions/getActiveNotifications';
import { getSignedInUserOrThrow } from '~/functions/getUser';

import { prismaClient } from '~/prismaClient';

export const POST = async (request: Request) => {
  const user = await getSignedInUserOrThrow();
  const { data } = await request.json();

  const notification = await prismaClient.notification.create({
    data: {
      expiringDate: new Date(data.expiringDate),
      message: data.message,
      authorId: user.id,
    },
  });

  revalidateTag(NOTIFICATIONS_CACHE_TAG);

  return Response.json(notification);
};
