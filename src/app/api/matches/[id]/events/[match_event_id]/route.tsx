import { prismaClient } from '~/prismaClient';

export const DELETE = async (_: Request, { params }: { params: { id: string; match_event_id: string } }) => {
  const parsedId = Number(params.match_event_id);
  await prismaClient.matchEvent.delete({
    where: {
      id: parsedId,
    },
  });

  return Response.json({});
};
