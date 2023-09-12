import { getPositions } from 'functions/getPositions';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const positions = await getPositions();
  return NextResponse.json(positions, {
    headers: {
      'Cache-Control': 's-maxage=604800',
    },
  });
};
