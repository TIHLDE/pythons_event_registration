import { getSignedInUserOrThrow } from 'functions/getUser';
import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import { NextResponse } from 'next/server';

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
  const { data, willArrive } = await request.json();

  if (typeof params.id === 'string') {
    const ids = params.id.split('_');
    const playerId = parseInt(ids[0]);
    const eventId = parseInt(ids[1]);

    const [user, existingRegistration] = await Promise.all([
      getSignedInUserOrThrow(),
      prisma.registrations.findFirstOrThrow({
        where: { playerId, eventId },
        include: { event: { select: { time: true } } },
      }),
    ]);

    if (user.id !== playerId) {
      return NextResponse.json({ message: `Du kan ikke endre andre spillere sine registreringer` }), { status: HttpStatusCode.FORBIDDEN };
    }

    if (existingRegistration.event.time < new Date()) {
      return NextResponse.json({ message: `Det er ikke lov å endre en registrering etter at arrangementet har startet` }), { status: HttpStatusCode.FORBIDDEN };
    }

    const registration = await prisma.registrations.update({
      where: {
        playerId_eventId: { playerId, eventId },
      },
      data: {
        updatedAt: existingRegistration.willArrive !== willArrive ? new Date() : undefined,
        willArrive: willArrive,
        reason: willArrive ? '' : data.reason || 'Oppga ikke grunn',
      },
    });
    return NextResponse.json(registration);
  } else {
    return NextResponse.json({ message: `Expected an id of the following format: "<player_id>_<event_id>"` }, { status: HttpStatusCode.BAD_REQUEST });
  }
};
