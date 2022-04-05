import HttpStatusCode from "http-status-typed";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const players = await prisma.player.findMany();
    res.json(players);
  } else if (req.method === "POST") {
    const {
      body: { data },
    } = req;

    const newPlayer = await prisma.player.create({
      data: {
        name: data.name,
        positionId: data.positionId,
      },
    });
    res.status(200).json(newPlayer);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
