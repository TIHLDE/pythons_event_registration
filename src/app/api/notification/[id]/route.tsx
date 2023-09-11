import { prisma } from 'lib/prisma';
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

  return NextResponse.json(result);
};

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
  const parsedId = parseInt(params.id);

  await prisma.notification.delete({
    where: {
      id: parsedId,
    },
  });

  return NextResponse.json({});
};
