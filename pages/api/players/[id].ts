import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const {
      query: { id },
    } = req;
    const parsedId = Number(typeof id === 'string' ? id : '-1');
    const player = await prisma.player.findFirst({ where: { id: parsedId }, include: { team: true } });
    res.json(player);
  } else if (req.method === 'PUT') {
    const {
      body: { data },
    } = req;
    const {
      query: { id },
    } = req;
    const parsedId = parseInt(typeof id === 'string' ? id : '-1');
    await prisma.player.update({
      where: {
        id: parsedId,
      },
      data: data,
    });
    res.status(HttpStatusCode.OK).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
