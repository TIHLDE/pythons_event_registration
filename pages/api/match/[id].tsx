import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

import { Result } from 'types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const {
      body: { data },
    } = req;
    const {
      query: { id },
    } = req;
    if (data.result.length !== 3) {
      res.status(HttpStatusCode.BAD_REQUEST).json({
        message: 'Resultatet må være 3 tegn',
      });
      return;
    }
    const parsedId = parseInt(typeof id === 'string' ? id : '-1');
    const homeGoals = parseInt(data.result[0]);
    const awayGoals = parseInt(data.result[2]);
    const result = homeGoals > awayGoals ? Result.Win : homeGoals < awayGoals ? Result.Loss : Result.Draw;
    await prisma.match.update({
      where: { id: parsedId },
      data: { result, homeGoals, awayGoals },
    }),
      res.status(HttpStatusCode.OK).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
