import { type NextRequest } from 'next/server';

import { getPlayers } from '~/functions/getPlayers';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const includeNotActive = searchParams.get('includeNotActive') !== null;
  const players = await getPlayers(includeNotActive);
  return Response.json(players);
};
