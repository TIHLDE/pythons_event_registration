import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const {
      query: { id },
    } = req;
    const parsedId = Number(typeof id === 'string' ? id : '-1');
    const matchEvents = await prisma.matchEvent.findMany({
      where: {
        matchId: parsedId,
      },
      include: {
        player: true,
      },
      orderBy: {
        type: 'asc',
      },
    });
    res.json(matchEvents);
  } else if (req.method === 'POST') {
    const {
      body: { data },
      query: { id },
    } = req;
    const parsedId = Number(typeof id === 'string' ? id : '-1');
    await prisma.matchEvent.create({
      data: {
        type: data.type,
        match: {
          connect: {
            id: parsedId,
          },
        },
        player: {
          connect: {
            id: data.playerId,
          },
        },
      },
    });
    res.status(200).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
