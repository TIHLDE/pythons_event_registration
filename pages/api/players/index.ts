import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const {
      query: { team },
    } = req;
    const parsedTeam = typeof team === 'string' ? Number(team) : undefined;
    const players = await prisma.player.findMany({ where: { active: true, teamId: parsedTeam } });
    res.json(players);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
