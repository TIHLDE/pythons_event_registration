import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createFine, FineCreate } from 'tihlde/fines';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { data },
    } = req;
    const fines: FineCreate[] = data.fines;

    await Promise.all(fines.map((fine) => createFine({ req, res }, fine)));

    await prisma.event.update({
      where: { id: data.eventId },
      data: { finesGiven: true },
    });

    res.status(HttpStatusCode.ACCEPTED).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
