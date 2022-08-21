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

    const result = await prisma.notification.update({
      where: {
        id: parsedId,
      },
      data: {
        message: data.message,
        expiringDate: new Date(data.expiringDate),
      },
    });

    res.status(HttpStatusCode.OK).json(result);
  } else if (req.method === 'DELETE') {
    const {
      query: { id },
    } = req;
    const parsedId = parseInt(typeof id === 'string' ? id : '-1');

    await prisma.notification.delete({
      where: {
        id: parsedId,
      },
    });

    res.status(HttpStatusCode.OK).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
