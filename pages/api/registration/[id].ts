import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const {
      query: { id },
      body: { data, willArrive },
    } = req;
    if (typeof id === 'string') {
      const ids = id.split('_');
      const playerId = parseInt(ids[0]);
      const eventId = parseInt(ids[1]);

      const existingRegistration = await prisma.registrations.findFirstOrThrow({
        where: { playerId, eventId },
        include: { event: { select: { time: true } } },
      });

      if (existingRegistration.event.time < new Date()) {
        return res.status(HttpStatusCode.FORBIDDEN).json({ message: `Det er ikke lov å endre en registrering etter at arrangementet har startet` });
      }

      await prisma.registrations.update({
        where: {
          playerId_eventId: { playerId, eventId },
        },
        data: {
          updatedAt: existingRegistration.willArrive !== willArrive ? new Date() : undefined,
          willArrive: willArrive,
          reason: willArrive ? '' : data.reason || 'Oppga ikke grunn',
        },
      });
      res.status(HttpStatusCode.OK).end();
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).json({ message: `Forventer 2 id'er med format: "<spiller-id>_<kamp-id>"` });
    }
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
