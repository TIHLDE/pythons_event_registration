import { Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { prisma } from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import safeJsonStringify from 'safe-json-stringify';
import useSWR from 'swr';

import { IEvent, INotification } from 'types';

import AlertMessage from 'components/AlertMessage';
import Event from 'components/Event';

export const getServerSideProps: GetServerSideProps = async () => {
  const today = new Date();
  const res = await prisma.event.findMany({
    where: {
      time: {
        gte: today,
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
  const { data: user } = useSWR('user', (key) => {
    const value = localStorage.getItem(key);
    return !!value ? JSON.parse(value) : undefined;
  });
  return (
    <>
      <Head>
        <title>Registrering - Pythons</title>
      </Head>
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        {notifications.map((notification: INotification) => (
          <Grid item key={notification.id} xs={12}>
            <AlertMessage notification={notification} />
          </Grid>
        ))}
        {!user && (
          <>
            <Typography>
              For å logge inn må du velge navnet ditt fra listen oppe til venstre. Dersom du ikke er på listen må du kontakte Filip, Jakob eller Kristian
            </Typography>
            <Divider sx={{ width: '100%', backgroundColor: 'white' }} />
          </>
        )}
        {!events.length && <Typography>Ingen kommende arrangementer</Typography>}
        {events.map((event: IEvent) => (
          <Grid item key={event.id} lg={3} md={4} sm={6} xs={12}>
            <Event eventDetails={event} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;
