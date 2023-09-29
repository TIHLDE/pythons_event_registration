import { NOTIFICATIONS_CACHE_TAG } from 'functions/getActiveNotifications';
import { prisma } from 'lib/prisma';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = parseInt(params.id);

  const result = await prisma.notification.update({
    where: {
      id: parsedId,
    },
    data: {
      message: data.message,
      expiringDate: new Date(data.expiringDate),
    },
  });

  revalidateTag(NOTIFICATIONS_CACHE_TAG);

  return NextResponse.json(result);
};

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
  const parsedId = parseInt(params.id);

  await prisma.notification.delete({
    where: {
      id: parsedId,
    },
  });

  revalidateTag(NOTIFICATIONS_CACHE_TAG);

  return NextResponse.json({});
};
