import { getEventTypes } from 'functions/getEventTypes';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const eventTypes = await getEventTypes();
  return NextResponse.json(eventTypes, {
    headers: {
      'Cache-Control': 's-maxage=604800',
    },
  });
};
