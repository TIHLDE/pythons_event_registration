import { revalidateTag } from 'next/cache';

import { NOTIFICATIONS_CACHE_TAG } from '~/functions/getActiveNotifications';
import { prismaClient } from '~/prismaClient';

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = parseInt(params.id);

  const result = await prismaClient.notification.update({
    where: {
      id: parsedId,
    },
    data: {
      message: data.message,
      expiringDate: new Date(data.expiringDate),
    },
  });

  revalidateTag(NOTIFICATIONS_CACHE_TAG);

  return Response.json(result);
};

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
  const parsedId = parseInt(params.id);

  await prismaClient.notification.delete({
    where: {
      id: parsedId,
    },
  });

  revalidateTag(NOTIFICATIONS_CACHE_TAG);

  return Response.json({});
};
