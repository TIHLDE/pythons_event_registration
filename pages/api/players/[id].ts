import HttpStatusCode from "http-status-typed";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const {
      body: { data },
    } = req;
    const {
      query: { id },
    } = req;
    const parsedId = parseInt(typeof id === "string" ? id : "-1");
    await prisma.player.update({
      where: {
        id: parsedId,
      },
      data: data,
    });
    res.status(HttpStatusCode.OK).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
