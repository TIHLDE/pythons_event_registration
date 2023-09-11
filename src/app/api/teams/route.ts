import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const teams = await prisma.team.findMany();
  return NextResponse.json(teams);
};

export const POST = async (request: Request) => {
  const { data } = await request.json();

  const newTeam = await prisma.team.create({
    data: {
      name: data.name,
    },
  });
  return NextResponse.json(newTeam);
};
