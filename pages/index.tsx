import { Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { addWeeks, endOfWeek, format, getWeek, parseISO, startOfWeek } from 'date-fns';
import nb from 'date-fns/locale/nb';
import { prisma } from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import safeJsonStringify from 'safe-json-stringify';

import { ExtendedNotification } from 'components/AdminMessage';
import AlertMessage from 'components/AlertMessage';
import Event, { ExtendedEvent } from 'components/Event';
import { EventsFilters, getEventsWhereFilter } from 'components/EventsFilters';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const allFutureEventsQuery = await prisma.event.findMany({
    include: {
      team: true,
      match: true,
      type: true,
      registrations: {
        include: {
          player: {
            include: {
              position: true,
            },
          },
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    ...(getEventsWhereFilter({ query }) as {}),
  });

  const playersQuery = await prisma.player.findMany({
    where: {
      active: true,
    },
  });

  const [allFutureEvents, players] = await Promise.all([allFutureEventsQuery, playersQuery]);

  const eventsWithArrivingList = allFutureEvents.map((event) => {
    const willArrive = event.registrations.filter((registration) => registration.willArrive);
    const willNotArrive = event.registrations.filter((registration) => !registration.willArrive);

    const hasNotResponded = players
      .filter((player) => !event.teamId || player.teamId === event.teamId)
      .map((player) => {
        const willArriveIds = willArrive.map((p) => p.playerId);
        const willNotArriveIds = willNotArrive.map((p) => p.playerId);
        const playerHasResponded = willArriveIds.includes(player.id) || willNotArriveIds.includes(player.id);

        if (!playerHasResponded) {
          return { player: player, playerId: player.id, willArrive: true };
        }
      })
      .filter(Boolean);
    return {
      ...event,
      willArrive: willArrive,
      willNotArrive: willNotArrive,
      hasNotResponded: hasNotResponded,
    };
  });

  const notificationsQuery = await prisma.notification.findMany({
    where: {
      expiringDate: {
        gt: new Date(),
      },
    },
    orderBy: {
      expiringDate: 'asc',
    },
    include: {
      author: true,
    },
  });

  const events = JSON.parse(safeJsonStringify(eventsWithArrivingList));
  const notifications = JSON.parse(safeJsonStringify(notificationsQuery));

  return {
    props: {
      events,
      notifications,
    },
  };
};

const Home: NextPage = ({ events, notifications }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const groupedEvents = (events as ExtendedEvent[]).reduce((acc, event) => {
    const time = parseISO(event.time as unknown as string);

    const getYearWeek = (time: Date) =>
      `Uke ${getWeek(time, { weekStartsOn: 1 })} (${format(startOfWeek(time, { weekStartsOn: 1 }), 'dd.MM', { locale: nb })}-${format(
        endOfWeek(time, { weekStartsOn: 1 }),
        'dd.MM',
        {
          locale: nb,
        },
      )})`;

    const thisYearWeek = getYearWeek(new Date());
    const nextYearWeek = getYearWeek(addWeeks(new Date(), 1));
    let yearWeek = getYearWeek(time);
    if (thisYearWeek === yearWeek) {
      yearWeek = 'Denne uken';
    }
    if (nextYearWeek === yearWeek) {
      yearWeek = 'Neste uke';
    }

    if (!acc[yearWeek]) {
      acc[yearWeek] = [];
    }

    acc[yearWeek].push(event);
    return acc;
  }, {} as Record<string, Array<ExtendedEvent>>);

  return (
    <>
      <Head>
        <title>Kalender - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h1'>Kalender</Typography>
        <Stack direction='row' spacing={1}>
          <Link href={`/?to=${format(new Date(), 'R-MM-dd')}&from=2022-07-01&eventType=kamp`} passHref>
            <Button color='secondary' component='a' variant='outlined'>
              Vis kampdetaljer
            </Button>
          </Link>
          <Link href='/statistikk' passHref>
            <Button color='secondary' component='a' variant='outlined'>
              Statistikk
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Stack gap={2}>
        {notifications.map((notification: ExtendedNotification) => (
          <AlertMessage key={notification.id} notification={notification} />
        ))}
        <EventsFilters />
        {!events.length && <Typography>Ingen kommende arrangementer</Typography>}
        {Object.keys(groupedEvents).map((group) => (
          <Stack gap={1} key={group}>
            <Typography variant='h3'>{group}</Typography>
            <Grid container spacing={2}>
              {groupedEvents[group].map((event) => (
                <Grid item key={event.id} md={4} sm={6} xs={12}>
                  <Event eventDetails={event} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export default Home;
