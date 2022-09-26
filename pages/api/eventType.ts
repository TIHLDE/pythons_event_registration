import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const eventTypes = await prisma.eventType.findMany();
    res.setHeader('Cache-Control', 's-maxage=604800');
    res.json(eventTypes);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
