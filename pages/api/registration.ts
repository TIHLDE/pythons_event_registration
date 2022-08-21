import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { data, willArrive },
    } = req;
    const result = await prisma.registrations.create({
      data: {
        eventId: data.eventId,
        willArrive: willArrive,
        playerId: data.playerId,
        ...(data.reason && {
          reason: data.reason,
        }),
      },
    });
    res.status(200).json(result);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
