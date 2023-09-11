import { Result } from '@prisma/client';
import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = Number(params.id);

  const homeGoals = Number(data.homeGoals);
  const awayGoals = Number(data.awayGoals);
  const result = homeGoals > awayGoals ? Result.WIN : homeGoals < awayGoals ? Result.LOSE : Result.DRAW;

  const match = await prisma.match.update({
    where: { id: parsedId },
    data: { result, homeGoals, awayGoals },
  });
  return NextResponse.json(match);
};