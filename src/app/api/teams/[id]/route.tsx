import { TEAMS_CACHE_TAG } from 'functions/getTeams';
import { prisma } from 'lib/prisma';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const DELETE = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = parseInt(params.id);
  await prisma.team.delete({
    where: {
      id: parsedId,
    },
  });

  revalidateTag(TEAMS_CACHE_TAG);

  return NextResponse.json({});
};
