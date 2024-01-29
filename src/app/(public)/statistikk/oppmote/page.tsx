import { EventType } from '@prisma/client';
import { getMonth, parseISO, set } from 'date-fns';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { PageProps } from '~/types';

import { getTeams } from '~/functions/getTeams';

import { AttendanceFilters } from '~/components/attendance/AttendanceFilters';
import { AttendanceTable } from '~/components/attendance/AttendanceTable';

import { prismaClient } from '~/prismaClient';

export const metadata: Metadata = {
  title: 'Oppmøte - TIHLDE Pythons',
};

const DEFAULT_TO_DATE = set(new Date(), { hours: 12, minutes: 0 });
const DEFAULT_FROM_DATE = set(new Date(), { month: getMonth(new Date()) > 6 ? 6 : 0, date: 1, hours: 12, minutes: 0 });

const getData = async ({ searchParams }: Pick<PageProps, 'searchParams'>) => {
  const dateTo = typeof searchParams.to === 'string' && searchParams.to !== '' ? parseISO(searchParams.to) : DEFAULT_TO_DATE;
  const dateFrom = typeof searchParams.from === 'string' && searchParams.from !== '' ? parseISO(searchParams.from) : DEFAULT_FROM_DATE;
  const eventTypeFilter = typeof searchParams.eventType === 'string' && searchParams.eventType !== '' ? searchParams.eventType : undefined;
  const teamFilter = typeof searchParams.team === 'string' && searchParams.team !== '' ? searchParams.team : undefined;
  const willArriveFilter =
    typeof searchParams.willArrive === 'string' && searchParams.team !== ''
      ? searchParams.willArrive === 'yes'
        ? true
        : searchParams.willArrive === 'no'
          ? false
          : null
      : undefined;

  if (!searchParams.to && !searchParams.from && !searchParams.eventType && !searchParams.team && !searchParams.willArrive) {
    redirect(
      `/statistikk/oppmote?to=${DEFAULT_TO_DATE.toJSON().substring(0, 10)}&from=${DEFAULT_FROM_DATE.toJSON().substring(0, 10)}&eventType=${
        EventType.TRAINING
      }&willArrive=yes`,
    );
  }

  const eventsAmountQuery = prismaClient.event.aggregate({
    _count: true,
    where: {
      AND: {
        time: {
          gte: dateFrom,
          lte: dateTo,
        },
        eventType: eventTypeFilter ? { in: eventTypeFilter.split(',') as EventType[] } : undefined,
      },
      ...(teamFilter ? { OR: [{ teamId: null }, { teamId: Number(teamFilter) }] } : {}),
    },
  });

  const playersQuery = prismaClient.player.findMany({
    where: {
      active: true,
      disableRegistrations: false,
      teamId: teamFilter ? Number(teamFilter) : undefined,
    },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          registrations: {
            where: {
              willArrive: willArriveFilter === null ? undefined : willArriveFilter,
              event: {
                AND: {
                  time: {
                    gte: dateFrom,
                    lt: dateTo,
                  },
                  eventType: eventTypeFilter ? { in: eventTypeFilter.split(',') as EventType[] } : undefined,
                },
                ...(teamFilter ? { OR: [{ teamId: null }, { teamId: Number(teamFilter) }] } : {}),
              },
            },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const [eventsAmount, players, teams] = await Promise.all([eventsAmountQuery, playersQuery, getTeams()]);
  const sortedPlayers = players
    .map((player) => ({
      name: player.name,
      count: willArriveFilter === null ? eventsAmount._count - player._count.registrations : player._count.registrations,
    }))
    .sort((a, b) => b.count - a.count);

  return { eventsAmount: eventsAmount._count, players: sortedPlayers, teams: teams };
};

const Attendance = async ({ searchParams }: PageProps) => {
  const { eventsAmount, players, teams } = await getData({ searchParams });

  return (
    <>
      <AttendanceFilters defaultFromDate={DEFAULT_FROM_DATE} defaultToDate={DEFAULT_TO_DATE} teams={teams} />
      <p className='my-4 text-sm'>
        Med gitt filtrering finnes det totalt <b>{eventsAmount}</b> arrangementer.
      </p>
      <AttendanceTable eventsAmount={eventsAmount} players={players} />
    </>
  );
};

export default Attendance;
