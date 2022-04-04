import HttpStatusCode from "http-status-typed";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      body: { data, willArrive },
    } = req;
    const result = await prisma.registrations.create({
      data: {
        eventId: data.eventId,
        willArrive: willArrive,
        playerId: data.playerId,
        ...(data.reason && {
          reason: data.reason,
        }),
      },
    });
    res.status(200).json(result);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
