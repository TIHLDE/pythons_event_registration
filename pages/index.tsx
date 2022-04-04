import type { NextPage } from "next";
import Container from "@mui/material/Container";
import NavBar from "../src/components/NavBar";
import Event from "../src/components/Event";
import Grid from "@mui/material/Grid";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { prisma } from "lib/prisma";
import safeJsonStringify from "safe-json-stringify";
import { IEvent } from "types";

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
      time: "desc",
    },
  });

  const eventsWithArrivingList = res.map((event) => {
    const willArrive = event.registrations.filter(
      (registration) => registration.willArrive
    );
    const willNotArrive = event.registrations.filter(
      (registration) => !registration.willArrive
    );
    return { ...event, willArrive: willArrive, willNotArrive: willNotArrive };
  });

  const events = JSON.parse(safeJsonStringify(eventsWithArrivingList));
  return {
    props: {
      events,
    },
  };
};

const Home: NextPage = ({
  events,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <NavBar />
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        {events.map((event: IEvent) => (
          <Grid key={event.id} item xs={12} sm={6} md={4} lg={3}>
            <Event eventDetails={event} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
