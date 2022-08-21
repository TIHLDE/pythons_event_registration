import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const {
      body: { data },
    } = req;
    const {
      query: { id },
    } = req;
    const parsedId = parseInt(typeof id === 'string' ? id : '-1');

    const updatedEvent = await prisma.event.update({
      where: {
        id: parsedId,
      },
      data: {
        eventTypeSlug: data.eventTypeSlug,
        title: data.eventTypeSlug === 'trening' ? '' : data.title,
        time: data.time,
        location: data.location,
      },
    });

    res.status(HttpStatusCode.OK).json(updatedEvent);
  } else if (req.method === 'DELETE') {
    const {
      query: { id },
    } = req;
    const parsedId = parseInt(typeof id === 'string' ? id : '-1');
    await prisma.event.delete({
      where: {
        id: parsedId,
      },
    });

    res.status(HttpStatusCode.OK).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
