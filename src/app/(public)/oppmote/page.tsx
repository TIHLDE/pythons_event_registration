import { Box, Divider, Typography, TypographyProps } from '@mui/material';
import { getMonth, parseISO, set } from 'date-fns';
import { prisma } from 'lib/prisma';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';

import { PageProps } from 'types';

import { AttendanceFilters } from 'components/attendance/AttendanceFilters';

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
    redirect(`/oppmote?to=${DEFAULT_TO_DATE.toJSON().substring(0, 10)}&from=${DEFAULT_FROM_DATE.toJSON().substring(0, 10)}&eventType=trening&willArrive=yes`);
  }

  const eventsAmountQuery = prisma.event.aggregate({
    _count: true,
    where: {
      AND: {
        time: {
          gte: dateFrom,
          lte: dateTo,
        },
        eventTypeSlug: eventTypeFilter ? { in: eventTypeFilter.split(',') } : undefined,
      },
      ...(teamFilter ? { OR: [{ teamId: null }, { teamId: Number(teamFilter) }] } : {}),
    },
  });

  const playersQuery = prisma.player.findMany({
    where: {
      active: true,
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
                  eventTypeSlug: eventTypeFilter ? { in: eventTypeFilter.split(',') } : undefined,
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

  const teamsQuery = prisma.team.findMany();
  const eventTypesQuery = prisma.eventType.findMany();

  const [eventsAmount, players, teams, eventTypes] = await Promise.all([eventsAmountQuery, playersQuery, teamsQuery, eventTypesQuery]);
  const sortedPlayers = players
    .map((player) => ({
      ...player,
      _count: { registrations: willArriveFilter === null ? eventsAmount._count - player._count.registrations : player._count.registrations },
    }))
    .sort((a, b) => b._count.registrations - a._count.registrations);

  return {
    eventsAmount: eventsAmount._count,
    players: sortedPlayers,
    teams: teams,
    eventTypes: eventTypes,
  };
};

const TableText = ({ children, sx }: Pick<TypographyProps, 'children' | 'sx'>) => (
  <Typography component='p' sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' }, ...sx }} variant='h3'>
    {children}
  </Typography>
);

const Attendance = async ({ searchParams }: PageProps) => {
  const { eventTypes, eventsAmount, players, teams } = await getData({ searchParams });

  return (
    <>
      <AttendanceFilters defaultFromDate={DEFAULT_FROM_DATE} defaultToDate={DEFAULT_TO_DATE} eventTypes={eventTypes} teams={teams} />
      <Typography gutterBottom>
        Med nåværende filtrering finnes det totalt <b>{eventsAmount}</b> arrangementer.
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', columnGap: 2, rowGap: 0.5 }}>
        <TableText sx={{ pl: 0.5, fontWeight: 'bold' }}>#</TableText>
        <TableText sx={{ fontWeight: 'bold' }}>Navn</TableText>
        <TableText sx={{ pr: 0.5, fontWeight: 'bold' }}>Antall</TableText>
        <Divider sx={{ gridColumn: 'span 3' }} />
        {players.map((player, index) => (
          <Fragment key={player.id}>
            <TableText sx={{ pl: 0.5 }}>{index + 1}.</TableText>
            <TableText sx={{}}>{player.name}</TableText>
            <TableText sx={{ pr: 0.5 }}>
              {player._count.registrations} ({Math.round((player._count.registrations / eventsAmount) * 100) || 0}%)
            </TableText>
            <Divider sx={{ gridColumn: 'span 3' }} />
          </Fragment>
        ))}
      </Box>
    </>
  );
};

export default Attendance;
