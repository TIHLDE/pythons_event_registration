import { getSignedInUserOrThrow } from 'functions/getUser';
import { prisma } from 'lib/prisma';
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

  return NextResponse.json(notification);
};
