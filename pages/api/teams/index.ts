import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } else if (req.method === 'POST') {
    const {
      body: { data },
    } = req;

    const newTeam = await prisma.team.create({
      data: {
        name: data.name,
      },
    });
    res.status(200).json(newTeam);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
