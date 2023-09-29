import { getTeams, TEAMS_CACHE_TAG } from 'functions/getTeams';
import { prisma } from 'lib/prisma';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const teams = await getTeams();
  return NextResponse.json(teams);
};

export const POST = async (request: Request) => {
  const { data } = await request.json();

  const newTeam = await prisma.team.create({
    data: {
      name: data.name,
    },
  });

  revalidateTag(TEAMS_CACHE_TAG);

  return NextResponse.json(newTeam);
};
