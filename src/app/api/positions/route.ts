import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const GET = async () => {
  const positions = await prisma.position.findMany();
  return NextResponse.json(positions, {
    headers: {
      'Cache-Control': 's-maxage=604800',
    },
  });
};
