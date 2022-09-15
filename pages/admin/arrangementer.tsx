import AddIcon from '@mui/icons-material/AddRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';

import AdminEvent from 'components/AdminEvent';
import { ExtendedEvent } from 'components/Event';
import EventModal from 'components/EventModal';

export const getServerSideProps: GetServerSideProps = async () => {
  const today = new Date();
  const eventsQuery = await prisma.event.findMany({
    include: {
      team: true,
      match: true,
    },
    where: {
      time: {
        gte: today,
      },
    },
    orderBy: {
      time: 'asc',
    },
  });
  const events = JSON.parse(safeJsonStringify(eventsQuery)) as Array<ExtendedEvent>;

  return { props: { events } };
};

const Players: NextPage = ({ events }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [newEventModal, setNewEventModal] = useState(false);
  const handleOpenNewEventModal = () => setNewEventModal(true);
  const handleCloseNewEventModal = () => setNewEventModal(false);
  return (
    <>
      <Head>
        <title>Arrangementer - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h1'>Arrangementer</Typography>
        <Link href='/admin' passHref>
          <Button color='secondary' component='a' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
            Til admin
          </Button>
        </Link>
      </Stack>
      {newEventModal && <EventModal handleClose={handleCloseNewEventModal} open={newEventModal} title={'Nytt arrangement'} />}
      <Grid container spacing={4}>
        {events.map((event: ExtendedEvent) => (
          <Grid item key={event.id} lg={3} md={4} sm={6} xs={12}>
            <AdminEvent event={event} />
          </Grid>
        ))}
        <Grid item lg={3} md={4} sm={6} xs={12}>
          <Button fullWidth onClick={handleOpenNewEventModal} startIcon={<AddIcon />} variant='contained'>
            Nytt arrangement
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Players;
