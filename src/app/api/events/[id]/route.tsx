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
      eventTypeSlug: data.eventTypeSlug,
      title: data.eventTypeSlug === 'trening' ? '' : data.title,
      time: data.time,
      location: data.location,
      teamId: data.eventTypeSlug === 'kamp' && data.team ? data.team : undefined,
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
