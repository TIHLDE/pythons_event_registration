import { NOTIFICATIONS_CACHE_TAG } from 'functions/getActiveNotifications';
import { getSignedInUserOrThrow } from 'functions/getUser';
import { prisma } from 'lib/prisma';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const user = await getSignedInUserOrThrow();
  const { data } = await request.json();

  const notification = await prisma.notification.create({
    data: {
      expiringDate: new Date(data.expiringDate),
      message: data.message,
      authorId: user.id,
    },
  });

  revalidateTag(NOTIFICATIONS_CACHE_TAG);

  return NextResponse.json(notification);
};
