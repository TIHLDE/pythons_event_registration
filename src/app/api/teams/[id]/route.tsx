import { revalidateTag } from 'next/cache';

import { TEAMS_CACHE_TAG } from '~/functions/getTeams';
import { prismaClient } from '~/prismaClient';

export const DELETE = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = parseInt(params.id);
  await prismaClient.team.delete({
    where: {
      id: parsedId,
    },
  });

  revalidateTag(TEAMS_CACHE_TAG);

  return Response.json({});
};
