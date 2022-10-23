import { Prisma } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPythonsMemberships } from 'tihlde/memberships';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const playersQuery = prisma.player.findMany();
    const tihldeMembershipsQuery = getAllPythonsMemberships({ req, res });
    const [players, memberships] = await Promise.all([playersQuery, tihldeMembershipsQuery]);

    const newPlayers: Prisma.Enumerable<Prisma.PlayerCreateManyInput> = memberships.results
      .filter((membership) => !players.some((player) => player.tihlde_user_id === membership.user.user_id))
      .map((membership) => ({ tihlde_user_id: membership.user.user_id, positionId: 1, name: `${membership.user.first_name} ${membership.user.last_name}` }));
    const createPlayersQuery = prisma.player.createMany({ data: newPlayers, skipDuplicates: true });

    const updatePlayersQueries = players
      .filter((player) => !memberships.results.some((membership) => membership.user.user_id === player.tihlde_user_id))
      .map((player) => prisma.player.update({ where: { id: player.id }, data: { active: false } }));

    await Promise.all([createPlayersQuery, ...updatePlayersQueries]);

    res.status(HttpStatusCode.OK).json({ detail: 'Successfully refreshed players' });
  } catch (e) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ error: (e as Error).message });
  }
}
