import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const DELETE = async (_: Request, { params }: { params: { id: string; match_event_id: string } }) => {
  const parsedId = Number(params.match_event_id);
  await prisma.matchEvent.delete({
    where: {
      id: parsedId,
    },
  });

  return NextResponse.json({});
};
