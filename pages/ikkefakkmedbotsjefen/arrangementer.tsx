import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Container from "@mui/material/Container";
import NavBar from "components/NavBar";
import Grid from "@mui/material/Grid";
import { IEvent, IPosition } from "types";
import { prisma } from "lib/prisma";
import safeJsonStringify from "safe-json-stringify";
import AdminEvent from "components/AdminEvent";
import { Button } from "@mui/material";
import { useState } from "react";
import EventModal from "components/EventModal";

export const getServerSideProps: GetServerSideProps = async () => {
  const today = new Date();
  const eventsQuery = await prisma.event.findMany({
    where: {
      time: {
        gte: today,
      },
    },
    orderBy: {
      time: "asc",
    },
  });
  const events = JSON.parse(safeJsonStringify(eventsQuery));

  return { props: { events } };
};

const Players: NextPage = ({
  events,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [newEventModal, setNewEventModal] = useState(false);
  const handleOpenNewEventModal = () => setNewEventModal(true);
  const handleCloseNewEventModal = () => setNewEventModal(false);

  return (
    <Container maxWidth="lg" sx={{ padding: 4 }}>
      <NavBar />
      <Button
        onClick={handleOpenNewEventModal}
        sx={{ marginTop: 2, marginBottom: 4 }}
      >
        Nytt arrangement
      </Button>
      {newEventModal && (
        <EventModal
          handleClose={handleCloseNewEventModal}
          open={newEventModal}
          title={"Nytt arrangement"}
        />
      )}
      <Grid container spacing={4}>
        {events.map((event: IEvent) => (
          <Grid item xs={12} sm={4} md={3}>
            <AdminEvent event={event} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Players;
