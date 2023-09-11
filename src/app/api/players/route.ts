import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const players = await prisma.player.findMany({ where: { active: true } });
  return NextResponse.json(players);
};
