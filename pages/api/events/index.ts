import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const players = await prisma.event.findMany();
    res.json(players);
  } else if (req.method === 'POST') {
    const {
      body: { data },
    } = req;
    await prisma.event.create({
      data: {
        location: data.location,
        time: new Date(data.time),
        eventTypeSlug: data.eventTypeSlug,
        ...(data.title &&
          data.eventTypeSlug !== 'trening' && {
            title: data.title,
          }),
        ...(data.team &&
          data.eventTypeSlug === 'kamp' && {
            teamId: Number(data.team),
            match: {
              create: {
                homeGoals: 0,
                awayGoals: 0,
                team: {
                  connect: {
                    id: Number(data.team),
                  },
                },
              },
            },
          }),
      },
    });
    res.status(200).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
