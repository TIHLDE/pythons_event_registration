import HttpStatusCode from "http-status-typed";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const players = await prisma.event.findMany();
    res.json(players);
  } else if (req.method === "POST") {
    const {
      body: { data },
    } = req;
    await prisma.event.create({
      data: {
        location: data.location,
        time: new Date(data.time),
        eventTypeSlug: data.eventTypeSlug,
        ...(data.title && {
          title: data.title,
        }),
      },
    });
    res.status(200).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
