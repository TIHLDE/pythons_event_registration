import { EventType } from '@prisma/client';
import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const { data } = await request.json();
  const parsedId = parseInt(params.id);

  const updatedEvent = await prisma.event.update({
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

  return NextResponse.json(updatedEvent);
};

export const DELETE = async (_: Request, { params }: { params: { id: string } }) => {
  const parsedId = parseInt(params.id);
  await prisma.event.delete({
    where: {
      id: parsedId,
    },
  });

  return NextResponse.json({});
};
