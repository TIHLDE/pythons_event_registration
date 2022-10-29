import { Prisma } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import { prisma } from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TIHLDEMembership } from 'tihlde';
import { getAllPythonsMemberships } from 'tihlde/memberships';

const membershipToName = (membership: TIHLDEMembership) => `${membership.user.first_name} ${membership.user.last_name}`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const playersQuery = prisma.player.findMany();
    const tihldeMembershipsQuery = getAllPythonsMemberships({ req, res });
    const [players, memberships] = await Promise.all([playersQuery, tihldeMembershipsQuery]);

    const newPlayers: Prisma.Enumerable<Prisma.PlayerCreateManyInput> = memberships.results
      .filter((membership) => !players.some((player) => player.tihlde_user_id === membership.user.user_id))
      .map((membership) => ({ tihlde_user_id: membership.user.user_id, positionId: 1, name: membershipToName(membership) }));
    const createPlayersQuery = prisma.player.createMany({ data: newPlayers, skipDuplicates: true });

    const updateActivePlayersQueries = players
      .filter((player) => !memberships.results.some((membership) => membership.user.user_id === player.tihlde_user_id))
      .map((player) => prisma.player.update({ where: { id: player.id }, data: { active: false } }));

    const updatePlayerNamesQueries = memberships.results
      .filter((membership) => {
        const player = players.find((p) => membership.user.user_id === p.tihlde_user_id);
        return Boolean(player && membershipToName(membership) !== player.name);
      })
      .map((membership) => prisma.player.updateMany({ where: { tihlde_user_id: membership.user.user_id }, data: { name: membershipToName(membership) } }));

    await Promise.all([createPlayersQuery, ...updateActivePlayersQueries, ...updatePlayerNamesQueries]);

    res.status(HttpStatusCode.OK).json({ detail: 'Successfully refreshed players' });
  } catch (e) {
    res.status(HttpStatusCode.BAD_REQUEST).json({ error: (e as Error).message });
  }
}
