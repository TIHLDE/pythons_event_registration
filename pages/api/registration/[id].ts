import HttpStatusCode from "http-status-typed";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const {
      query: { id },
    } = req;
    const {
      body: { data, willArrive },
    } = req;
    if (typeof id === "string") {
      const ids = id.split("_");
      const playerId = parseInt(ids[0]);
      const eventId = parseInt(ids[1]);

      await prisma.registrations.update({
        where: {
          playerId_eventId: { playerId, eventId },
        },
        data: {
          updatedAt: data.updatedAt,
          willArrive: willArrive,
          ...(data.reason && !willArrive
            ? {
                reason: data.reason,
              }
            : { reason: "" }),
        },
      });
      res.status(HttpStatusCode.OK).end();
    } else {
      res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ message: "Forventer 2 id'er" });
    }
  } else if (req.method === "GET") {
    const {
      query: { id },
    } = req;
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
