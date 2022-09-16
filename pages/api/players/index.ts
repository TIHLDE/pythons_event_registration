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
  } else if (req.method === 'POST') {
    const {
      body: { data },
    } = req;

    const newPlayer = await prisma.player.create({
      data: {
        name: data.name,
        positionId: data.positionId,
        teamId: data.teamId,
      },
    });
    res.status(200).json(newPlayer);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}