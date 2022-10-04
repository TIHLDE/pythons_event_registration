import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const {
      query: { match_event_id },
    } = req;
    const parsedId = Number(typeof match_event_id === 'string' ? match_event_id : '-1');
    await prisma.matchEvent.delete({
      where: {
        id: parsedId,
      },
    });

    res.status(HttpStatusCode.OK).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
