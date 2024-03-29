'use server';

import { Position, Prisma } from '@prisma/client';
import { revalidateTag } from 'next/cache';

import { PLAYERS_CACHE_TAG } from '~/functions/getPlayers';
import { TIHLDEMembership } from '~/tihlde';
import { getAllPythonsMemberships } from '~/tihlde/memberships';

import { prismaClient } from '~/prismaClient';

const membershipToName = (membership: TIHLDEMembership) => `${membership.user.first_name} ${membership.user.last_name}`;

export const syncPlayers = async () => {
  try {
    const playersQuery = prismaClient.player.findMany();
    const tihldeMembershipsQuery = getAllPythonsMemberships();
    const [players, memberships] = await Promise.all([playersQuery, tihldeMembershipsQuery]);

    // Create new players when there are new memberships at TIHLDE.org
    const newPlayers: Prisma.Enumerable<Prisma.PlayerCreateManyInput> = memberships.results
      .filter((membership) => !players.some((player) => player.tihlde_user_id === membership.user.user_id))
      .map((membership) => ({ tihlde_user_id: membership.user.user_id, position: Position.KEEPER, name: membershipToName(membership) }));
    const createPlayersQuery = prismaClient.player.createMany({ data: newPlayers, skipDuplicates: true });

    // Deactivate players when they are no longer a member of the group at TIHLDE.org
    const updateActivePlayersQueries = players
      .filter((player) => !memberships.results.some((membership) => membership.user.user_id === player.tihlde_user_id))
      .map((player) => prismaClient.player.update({ where: { id: player.id }, data: { active: false } }));

    // Reactivate players when which rejoin the group at TIHLDE.org
    const updateDeactivatedPlayersQueries = players
      .filter((player) => !player.active && memberships.results.some((membership) => membership.user.user_id === player.tihlde_user_id))
      .map((player) => prismaClient.player.update({ where: { id: player.id }, data: { active: true } }));

    // Update the player's name if it have changed at TIHLDE.org
    const updatePlayerNamesQueries = memberships.results
      .filter((membership) => {
        const player = players.find((p) => membership.user.user_id === p.tihlde_user_id);
        return Boolean(player && membershipToName(membership) !== player.name);
      })
      .map((membership) =>
        prismaClient.player.updateMany({ where: { tihlde_user_id: membership.user.user_id }, data: { name: membershipToName(membership) } }),
      );

    await Promise.all([createPlayersQuery, ...updateActivePlayersQueries, ...updateDeactivatedPlayersQueries, ...updatePlayerNamesQueries]);

    revalidateTag(PLAYERS_CACHE_TAG);

    return { ok: true, detail: 'Successfully refreshed players' } as const;
  } catch (e) {
    return { ok: false, error: (e as Error).message } as const;
  }
};
