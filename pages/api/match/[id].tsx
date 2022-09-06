import { Result } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const {
      body: { data },
    } = req;
    const {
      query: { id },
    } = req;
    const [homeGoals, awayGoals] = data.result.split('-').map((goals: string) => parseInt(goals));

    const parsedId = parseInt(typeof id === 'string' ? id : '-1');
    /* const homeGoals = parseInt(data.result[0]);
    const awayGoals = parseInt(data.result[2]); */
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
