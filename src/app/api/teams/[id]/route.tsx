import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const DELETE = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = parseInt(params.id);
  await prisma.team.delete({
    where: {
      id: parsedId,
    },
  });

  return NextResponse.json({});
};
