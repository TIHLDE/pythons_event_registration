import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { EventType, Team } from '@prisma/client';
import { getMonth, parseISO, set } from 'date-fns';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { Controller, useForm } from 'react-hook-form';
import safeJsonStringify from 'safe-json-stringify';

const removeFalsyElementsFromObject = (object: Record<string, string>) => {
  const newObject: Record<string, string> = {};
  Object.keys(object).forEach((key) => {
    if (object[key]) {
      newObject[key] = object[key];
    }
  });
  return newObject;
};

const DEFAULT_TO_DATE = set(new Date(), { hours: 12, minutes: 0 });
const DEFAULT_FROM_DATE = set(new Date(), { month: getMonth(new Date()) > 6 ? 6 : 0, date: 1, hours: 12, minutes: 0 });

type StatisticsProps = {
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

export const getServerSideProps: GetServerSideProps<StatisticsProps> = async ({ query }) => {
  const dateTo = typeof query.to === 'string' && query.to !== '' ? parseISO(query.to) : DEFAULT_TO_DATE;
  const dateFrom = typeof query.from === 'string' && query.from !== '' ? parseISO(query.from) : DEFAULT_FROM_DATE;
  const eventTypeFilter = typeof query.eventType === 'string' && query.eventType !== '' ? query.eventType : undefined;
  const teamFilter = typeof query.team === 'string' && query.team !== '' ? query.team : undefined;
  const willArriveFilter =
    typeof query.willArrive === 'string' && query.team !== '' ? (query.willArrive === 'yes' ? true : query.willArrive === 'no' ? false : null) : true;

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

type FormData = {
  from: string;
  to: string;
  eventType: string;
  team: string;
  willArrive: string;
};

const Statistics = ({ players, eventsAmount, teams, eventTypes }: StatisticsProps) => {
  const router = useRouter();
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      to: typeof router.query.to === 'string' && router.query.to !== '' ? router.query.to : DEFAULT_TO_DATE.toJSON().substring(0, 10),
      from: typeof router.query.from === 'string' && router.query.from !== '' ? router.query.from : DEFAULT_FROM_DATE.toJSON().substring(0, 10),
      eventType: typeof router.query.eventType === 'string' ? router.query.eventType : '',
      team: typeof router.query.team === 'string' ? router.query.team : '',
      willArrive: typeof router.query.willArrive === 'string' ? router.query.willArrive : 'yes',
    },
  });

  const onSubmit = async (query: FormData) => router.replace({ query: removeFalsyElementsFromObject(query) });

  return (
    <>
      <Head>
        <title>Statistikk - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h1'>Statistikk</Typography>
        <Link href='/' passHref>
          <Button color='secondary' component='a' variant='outlined'>
            Til forsiden
          </Button>
        </Link>
      </Stack>
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
          Oppdater
        </Button>
      </Box>
      <Divider sx={{ mt: 1, mb: 2 }} />
      <Typography gutterBottom variant='h2'>
        Oppmøte-ledertavle
      </Typography>
      <Typography gutterBottom>
        Med den gitte filtreringen finnes det totalt <b>{eventsAmount}</b> arrangementer. Husk at om kamper er en del av filtreringen uten at et lag er valgt,
        så vil ingen ha 100% påmeldinger ettersom det ikke er mulig å melde seg på andre lags kamper.
      </Typography>
      <Divider sx={{ mb: 0.5 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', columnGap: 2, rowGap: 0.5 }}>
        {players.map((player, index) => (
          <Fragment key={player.id}>
            <Typography component='p' sx={{ pl: 0.5, fontSize: { xs: '1.2rem', md: '1.5rem' } }} variant='h3'>
              {index + 1}.
            </Typography>
            <Typography component='p' sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }} variant='h3'>
              {player.name}
            </Typography>
            <Typography component='p' sx={{ pr: 0.5, fontSize: { xs: '1.2rem', md: '1.5rem' } }} variant='h3'>
              {player._count.registrations} ({Math.round((player._count.registrations / eventsAmount) * 100) || 0}%)
            </Typography>
            <Divider sx={{ gridColumn: 'span 3' }} />
          </Fragment>
        ))}
      </Box>
    </>
  );
};

export default Statistics;
