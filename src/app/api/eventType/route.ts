import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const eventTypes = await prisma.eventType.findMany();
  return NextResponse.json(eventTypes, {
    headers: {
      'Cache-Control': 's-maxage=604800',
    },
  });
};
