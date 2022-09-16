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
    console.log('Recevied put');
    const parsedId = Number(typeof id === 'string' ? id : '-1');
    console.log('parsedId', parsedId);

    const homeGoals = Number(data.homeGoals);
    console.log('homeGoals', homeGoals);

    const awayGoals = Number(data.awayGoals);
    console.log('awayGoals', awayGoals);
    const result = homeGoals > awayGoals ? Result.WIN : homeGoals < awayGoals ? Result.LOSE : Result.DRAW;
    console.log('result', result);
    console.log('Updating match');
    const match = await prisma.match.update({
      where: { id: parsedId },
      data: { result, homeGoals, awayGoals },
    });
    console.log('Updated match', match);

    res.status(HttpStatusCode.OK).json(match);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
