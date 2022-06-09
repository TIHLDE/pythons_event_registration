import HttpStatusCode from "http-status-typed";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      body: { data },
    } = req;
    await prisma.notification.create({
      data: {
        expiringDate: new Date(data.expiringDate),
        message: data.message,
        authorId: data.authorId,
      },
    });

    res.status(200).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
