import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { addWeeks, endOfWeek, format, getWeek, parseISO, startOfWeek } from 'date-fns';
import nb from 'date-fns/locale/nb';
import { prisma } from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import safeJsonStringify from 'safe-json-stringify';

import { ExtendedNotification } from 'components/AdminMessage';
import AlertMessage from 'components/AlertMessage';
import { CalendarSubscription } from 'components/CalendarSubscription';
import Event, { ExtendedEvent } from 'components/Event';
import { EventsFilters, getEventsWhereFilter } from 'components/EventsFilters';
import { MainLinkMenu } from 'components/LinkMenu';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const notificationsQuery = prisma.notification.findMany({
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

  const allFutureEventsQuery = prisma.event.findMany({
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

  const playersQuery = prisma.player.findMany({
    where: {
      active: true,
    },
  });

  const [allFutureEvents, players, notifications] = await Promise.all([allFutureEventsQuery, playersQuery, notificationsQuery]);

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

  return {
    props: {
      events: JSON.parse(safeJsonStringify(eventsWithArrivingList)),
      notifications: JSON.parse(safeJsonStringify(notifications)),
    },
  };
};

const getYearWeek = (time: Date) =>
  `Uke ${getWeek(time, { weekStartsOn: 1 })} (${format(startOfWeek(time, { weekStartsOn: 1 }), 'dd.MM', { locale: nb })}-${format(
    endOfWeek(time, { weekStartsOn: 1 }),
    'dd.MM',
    {
      locale: nb,
    },
  )})`;

const Home: NextPage = ({ events, notifications }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const groupedEvents = (events as ExtendedEvent[]).reduce((acc, event) => {
    const time = parseISO(event.time as unknown as string);

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
      <MainLinkMenu sx={{ mb: 2 }} />
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
        <CalendarSubscription sx={{ mt: 2 }} />
      </Stack>
    </>
  );
};

export default Home;
