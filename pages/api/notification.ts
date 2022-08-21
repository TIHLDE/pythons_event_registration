import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
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
