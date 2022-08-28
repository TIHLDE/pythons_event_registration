import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { addWeeks, endOfWeek, format, getWeek, parseISO, startOfToday, startOfWeek } from 'date-fns';
import nb from 'date-fns/locale/nb';
import { prisma } from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import safeJsonStringify from 'safe-json-stringify';

import { IEvent, INotification } from 'types';

import AlertMessage from 'components/AlertMessage';
import Event from 'components/Event';

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await prisma.event.findMany({
    where: {
      time: {
        gte: startOfToday(),
      },
    },
    include: {
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
    orderBy: {
      time: 'asc',
    },
  });

  const players = await prisma.player.findMany({
    where: {
      active: true,
    },
  });

  const eventsWithArrivingList = res.map((event) => {
    const willArrive = event.registrations.filter((registration) => registration.willArrive);
    const willNotArrive = event.registrations.filter((registration) => !registration.willArrive);

    const hasNotResponded = players
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
  const groupedEvents = (events as IEvent[]).reduce((acc, event) => {
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
  }, {} as Record<string, Array<IEvent>>);

  return (
    <>
      <Head>
        <title>Registrering - Pythons</title>
      </Head>
      <Stack gap={2}>
        {notifications.map((notification: INotification) => (
          <AlertMessage key={notification.id} notification={notification} />
        ))}
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
