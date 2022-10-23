import axios from 'axios';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { PaginationResponse, TIHLDEGroupFine, TIHLDEMembership, TIHLDEUser } from 'tihlde';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { username, password },
    } = req;
    try {
      const auth = await axios.post<{ token: string }>('https://api.tihlde.org/auth/login/', { user_id: username, password });

      const token = auth.data.token;
      const membershipsQuery = axios.get<PaginationResponse<TIHLDEMembership>>(
        'https://api.tihlde.org/groups/pythons-gutter-a/memberships/?&onlyMembers=true&None=500',
        {
          headers: { 'x-csrf-token': token },
        },
      );

      const notPayedFinesQuery = axios.get<PaginationResponse<TIHLDEGroupFine>>(
        'https://api.tihlde.org/groups/pythons-gutter-a/fines/?&payed=false&None=1500',
        {
          headers: { 'x-csrf-token': token },
        },
      );
      const [
        {
          data: { results: memberships },
        },
        {
          data: { results: notPayedFines },
        },
      ] = await Promise.all([membershipsQuery, notPayedFinesQuery]);
      const users = memberships.map((membership) => membership.user);

      const usersWithNoCreatedFines = users.filter((user) => !notPayedFines.some((fine) => fine.created_by.user_id === user.user_id));
      const mappedUsers: Array<TIHLDEUser> = usersWithNoCreatedFines.map((user) => ({
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
      }));
      res.json(mappedUsers);
    } catch (e) {
      console.error(e);
      res.status(HttpStatusCode.BAD_REQUEST).end();
    }
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
