import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticate } from 'tihlde/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { user_id, password },
    } = req;
    try {
      await authenticate({ user_id, password }, req, res);
      res.status(HttpStatusCode.NO_CONTENT).end();
    } catch (e) {
      res.status(HttpStatusCode.BAD_REQUEST).json({ error: (e as Error).message });
    }
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
