import { PLAYERS_CACHE_TAG } from 'functions/getPlayers';
import { prisma } from 'lib/prisma';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const GET = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = Number(params.id);
  const player = await prisma.player.findFirst({ where: { id: parsedId }, include: { team: true } });
  return NextResponse.json(player);
};

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = Number(params.id);
  const player = await prisma.player.update({
    where: {
      id: parsedId,
    },
    data: data,
  });
  revalidateTag(PLAYERS_CACHE_TAG);
  return NextResponse.json(player);
};
