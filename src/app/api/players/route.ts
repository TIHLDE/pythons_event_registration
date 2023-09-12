import { getPlayers } from 'functions/getPlayers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const players = await getPlayers();
  return NextResponse.json(players);
};
