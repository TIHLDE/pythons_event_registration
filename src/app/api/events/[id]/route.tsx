import { EventType } from '@prisma/client';

import { prismaClient } from '~/prismaClient';

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = parseInt(params.id);

  const updatedEvent = await prismaClient.event.update({
    where: {
      id: parsedId,
    },
    data: {
      eventType: data.eventType,
      title: data.eventType === EventType.TRAINING ? '' : data.title,
      time: data.time,
      location: data.location,
      teamId: data.eventType === EventType.MATCH && data.team ? data.team : undefined,
      finesGiven: data.finesGiven ?? undefined,
    },
  });

  return Response.json(updatedEvent);
};

export const DELETE = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = parseInt(params.id);
  await prismaClient.event.delete({
    where: {
      id: parsedId,
    },
  });

  return Response.json({});
};
