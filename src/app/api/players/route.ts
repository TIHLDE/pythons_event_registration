import { getPlayers } from 'functions/getPlayers';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const players = await getPlayers();
  return Response.json(players);
};
