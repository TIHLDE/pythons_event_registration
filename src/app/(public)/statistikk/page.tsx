import { MatchEventType } from '@prisma/client';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { PageProps } from '~/types';

import { getTeams } from '~/functions/getTeams';
import { prismaClient } from '~/prismaClient';

import { StatisticsFilters } from '~/components/statistics/StatisticsFilters';
import { StatisticsTable } from '~/components/statistics/StatisticsTable';

import { getSemesters } from '~/utils';

export const metadata: Metadata = {
  title: 'Statistikk - TIHLDE Pythons',
};

const semesters = getSemesters();

const getData = async ({ searchParams }: Pick<PageProps, 'searchParams'>) => {
  const semesterFilter =
    typeof searchParams.semester === 'string' && searchParams.semester !== '' ? semesters.find((semester) => semester.id === searchParams.semester) : undefined;
  const teamFilter = typeof searchParams.team === 'string' && searchParams.team !== '' ? Number(searchParams.team) : undefined;
  const matchEventTypeFilter =
    typeof searchParams.matchEventType === 'string' && searchParams.matchEventType !== ''
      ? (searchParams.matchEventType as MatchEventType)
      : MatchEventType.GOAL;

  if (!searchParams.semester && !searchParams.team && !searchParams.matchEventType) {
    return redirect(`/statistikk?semester=${semesters[semesters.length - 1].id}&matchEventType=${MatchEventType.GOAL}`);
  }

  const playersQuery = prismaClient.player.findMany({
    include: {
      _count: {
        select: {
          matchEvents: {
            where: {
              type: matchEventTypeFilter,
              match: {
                is: {
                  teamId: teamFilter,
                  event: {
                    is: {
                      time: semesterFilter
                        ? {
                            gte: semesterFilter.from,
                            lte: semesterFilter.to,
                          }
                        : undefined,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const [teams, players] = await Promise.all([getTeams(), playersQuery]);
  const sortedPlayers = players
    .map((player) => ({ name: player.name, count: player._count.matchEvents }))
    .filter((player) => player.count > 0)
    .sort((a, b) => b.count - a.count);

  return {
    players: sortedPlayers,
    teams: teams,
  };
};

const Statistics = async ({ searchParams }: PageProps) => {
  const { teams, players } = await getData({ searchParams });

  return (
    <>
      <StatisticsFilters teams={teams} />
      <StatisticsTable players={players} />
    </>
  );
};

export default Statistics;
