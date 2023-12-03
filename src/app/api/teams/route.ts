import { revalidateTag } from 'next/cache';

import { getTeams, TEAMS_CACHE_TAG } from '~/functions/getTeams';
import { prismaClient } from '~/prismaClient';

export const dynamic = 'force-dynamic';

export const GET = async () => {
  const teams = await getTeams();
  return Response.json(teams);
};

export const POST = async (request: Request) => {
  const { data } = await request.json();

  const newTeam = await prismaClient.team.create({
    data: {
      name: data.name,
    },
  });

  revalidateTag(TEAMS_CACHE_TAG);

  return Response.json(newTeam);
};
