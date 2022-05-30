import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Grid from "@mui/material/Grid";
import { IEvent, IPosition } from "types";
import AddIcon from "@mui/icons-material/Add";
import { prisma } from "lib/prisma";
import safeJsonStringify from "safe-json-stringify";
import AdminEvent from "components/AdminEvent";
import { Button, ButtonBase, Stack, Typography } from "@mui/material";
import { useState } from "react";
import EventModal from "components/EventModal";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import Head from "next/head";

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
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Arrangementer - Pythons</title>
      </Head>
      <Button onClick={() => router.push("/admin")}>
        Tilbake til admin-side
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
        <Grid item xs={12} sm={4} md={3}>
          <ButtonBase onClick={handleOpenNewEventModal}>
            <Stack direction={"column"}>
              <AddIcon color="secondary" fontSize="large" />
              <Typography>Nytt arrangement</Typography>
            </Stack>
          </ButtonBase>
        </Grid>
      </Grid>
    </>
  );
};

export default Players;
