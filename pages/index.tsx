import type { NextPage } from "next";
import Event from "../src/components/Event";
import Grid from "@mui/material/Grid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { prisma } from "lib/prisma";
import safeJsonStringify from "safe-json-stringify";
import { IEvent, INotification } from "types";
import { Divider, Typography } from "@mui/material";
import Head from "next/head";
import AlertMessage from "components/AlertMessage";
import useSWR from "swr";

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
      time: "asc",
    },
  });

  const players = await prisma.player.findMany({
    where: {
      active: true,
    },
  });

  const eventsWithArrivingList = res.map((event) => {
    const willArrive = event.registrations.filter(
      (registration) => registration.willArrive
    );
    const willNotArrive = event.registrations.filter(
      (registration) => !registration.willArrive
    );

    const hasNotResponded = players
      .map((player) => {
        const willArriveIds = willArrive.map((p) => p.playerId);
        const willNotArriveIds = willNotArrive.map((p) => p.playerId);
        const playerHasResponded =
          willArriveIds.includes(player.id) ||
          willNotArriveIds.includes(player.id);

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
      expiringDate: "asc",
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

const Home: NextPage = ({
  events,
  notifications,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: user } = useSWR("user", (key) => {
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
          <Grid key={notification.id} item xs={12}>
            <AlertMessage notification={notification} />
          </Grid>
        ))}
        {!user && (
          <>
            <Typography>
              For å logge inn må du velge navnet ditt fra listen oppe til
              venstre. Dersom du ikke er på listen må du kontakte Filip, Jakob
              eller Kristian
            </Typography>
            <Divider sx={{ width: "100%", backgroundColor: "white" }} />
          </>
        )}
        {!events.length && (
          <Typography>Ingen kommende arrangementer</Typography>
        )}
        {events.map((event: IEvent) => (
          <Grid key={event.id} item xs={12} sm={6} md={4} lg={3}>
            <Event eventDetails={event} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;
