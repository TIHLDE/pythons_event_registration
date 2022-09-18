import { Result } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const {
      body: { data },
    } = req;
    const {
      query: { id },
    } = req;
    const parsedId = Number(typeof id === 'string' ? id : '-1');

    const homeGoals = Number(data.homeGoals);
    const awayGoals = Number(data.awayGoals);
    const result = homeGoals > awayGoals ? Result.WIN : homeGoals < awayGoals ? Result.LOSE : Result.DRAW;

    await prisma.match.update({
      where: { id: parsedId },
      data: { result, homeGoals, awayGoals },
    }),
      res.status(HttpStatusCode.OK).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
