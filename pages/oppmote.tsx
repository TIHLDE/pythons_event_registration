import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { Alert, Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField, Typography, TypographyProps } from '@mui/material';
import { EventType, Team } from '@prisma/client';
import { getMonth, parseISO, set } from 'date-fns';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import safeJsonStringify from 'safe-json-stringify';
import { removeFalsyElementsFromObject } from 'utils';

import { StandaloneExpand } from 'components/Expand';
import { MainLinkMenu } from 'components/LinkMenu';

const DEFAULT_TO_DATE = set(new Date(), { hours: 12, minutes: 0 });
const DEFAULT_FROM_DATE = set(new Date(), { month: getMonth(new Date()) > 6 ? 6 : 0, date: 1, hours: 12, minutes: 0 });

type AttendanceProps = {
  eventsAmount: number;
  players: {
    _count: {
      registrations: number;
    };
    id: number;
    name: string;
  }[];
  teams: Team[];
  eventTypes: EventType[];
};

export const getServerSideProps: GetServerSideProps<AttendanceProps> = async ({ query }) => {
  const dateTo = typeof query.to === 'string' && query.to !== '' ? parseISO(query.to) : DEFAULT_TO_DATE;
  const dateFrom = typeof query.from === 'string' && query.from !== '' ? parseISO(query.from) : DEFAULT_FROM_DATE;
  const eventTypeFilter = typeof query.eventType === 'string' && query.eventType !== '' ? query.eventType : undefined;
  const teamFilter = typeof query.team === 'string' && query.team !== '' ? query.team : undefined;
  const willArriveFilter =
    typeof query.willArrive === 'string' && query.team !== '' ? (query.willArrive === 'yes' ? true : query.willArrive === 'no' ? false : null) : undefined;

  if (!query.to && !query.from && !query.eventType && !query.team && !query.willArrive) {
    return {
      redirect: {
        destination: `/oppmote?to=${DEFAULT_TO_DATE.toJSON().substring(0, 10)}&from=${DEFAULT_FROM_DATE.toJSON().substring(
          0,
          10,
        )}&eventType=trening&willArrive=yes`,
        permanent: false,
      },
    };
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
    props: {
      eventsAmount: eventsAmount._count,
      players: sortedPlayers,
      teams: JSON.parse(safeJsonStringify(teams)),
      eventTypes: JSON.parse(safeJsonStringify(eventTypes)),
    },
  };
};

const TableText = ({ children, sx }: Pick<TypographyProps, 'children' | 'sx'>) => (
  <Typography component='p' sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' }, ...sx }} variant='h3'>
    {children}
  </Typography>
);

type FormData = {
  from: string;
  to: string;
  eventType: string;
  team: string;
  willArrive: string;
};

const Attendance = ({ players, eventsAmount, teams, eventTypes }: AttendanceProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      to: typeof router.query.to === 'string' && router.query.to !== '' ? router.query.to : DEFAULT_TO_DATE.toJSON().substring(0, 10),
      from: typeof router.query.from === 'string' && router.query.from !== '' ? router.query.from : DEFAULT_FROM_DATE.toJSON().substring(0, 10),
      eventType: typeof router.query.eventType === 'string' ? router.query.eventType : '',
      team: typeof router.query.team === 'string' ? router.query.team : '',
      willArrive: typeof router.query.willArrive === 'string' ? router.query.willArrive : '',
    },
  });

  const onSubmit = async (query: FormData) => {
    router.replace({ query: removeFalsyElementsFromObject(query) }, undefined, { scroll: false });
    setOpen(false);
  };

  return (
    <>
      <Head>
        <title>Oppmøte - Pythons</title>
      </Head>
      <MainLinkMenu sx={{ mb: 2 }} />
      <StandaloneExpand expanded={open} icon={<FilterListRoundedIcon />} onExpand={() => setOpen((prev) => !prev)} primary='Filtrering' sx={{ mb: 2 }}>
        <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ pt: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1 }}>
          <Controller control={control} name='from' render={({ field }) => <TextField label='Fra' type='date' {...field} />} />
          <Controller control={control} name='to' render={({ field }) => <TextField label='Til' type='date' {...field} />} />
          <FormControl fullWidth>
            <InputLabel id='selectType-type'>Type</InputLabel>
            <Controller
              control={control}
              name='eventType'
              render={({ field }) => (
                <Select id='type' label='Type' labelId='selectType-type' {...field}>
                  <MenuItem value=''>Alle</MenuItem>
                  {eventTypes.map((eventType) => (
                    <MenuItem key={eventType.slug} value={eventType.slug}>
                      {eventType.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='select-team'>Lag</InputLabel>
            <Controller
              control={control}
              name='team'
              render={({ field }) => (
                <Select id='team' label='Lag' labelId='select-team' {...field}>
                  <MenuItem value=''>Alle</MenuItem>
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='select-willArrive'>Oppmøte</InputLabel>
            <Controller
              control={control}
              name='willArrive'
              render={({ field }) => (
                <Select id='willArrive' label='Oppmøte' labelId='select-willArrive' {...field}>
                  <MenuItem value=''>Alle</MenuItem>
                  <MenuItem value='yes'>Ja</MenuItem>
                  <MenuItem value='no'>Nei</MenuItem>
                  <MenuItem value='none'>Ikke registrert</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          <Button sx={{ gridColumn: { xs: undefined, md: 'span 2' } }} type='submit' variant='contained'>
            Oppdater filtre
          </Button>
        </Box>
      </StandaloneExpand>
      <Typography gutterBottom>
        Med nåværende filtrering finnes det totalt <b>{eventsAmount}</b> arrangementer.
      </Typography>
      {(router.query.eventType === 'kamp' || !router.query.eventType) && !router.query.team && (
        <Alert severity='info' sx={{ mb: 1 }} variant='outlined'>
          Kamper er en del av filtreringen uten at et lag er valgt. Det medfører at ingen kan ha 100% påmeldinger ettersom det ikke er mulig å melde seg på
          andre lags kamper.
        </Alert>
      )}
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
