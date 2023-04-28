import AddIcon from '@mui/icons-material/AddRounded';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Button, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ExtendedEvent } from 'queries';
import { useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';

import AdminEvent from 'components/AdminEvent';
import EventModal from 'components/EventModal';
import { EventsFilters, getEventsWhereFilter } from 'components/EventsFilters';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const eventsQuery = await prisma.event.findMany({
    include: {
      team: true,
      match: true,
    },
    ...getEventsWhereFilter({ query }),
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
        <Button color='secondary' component={Link} href='/admin' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
          Til admin
        </Button>
      </Stack>
      <EventsFilters sx={{ mb: 2 }} />
      {newEventModal && <EventModal handleClose={handleCloseNewEventModal} open={newEventModal} title={'Nytt arrangement'} />}
      <Grid container spacing={4}>
        {events.map((event: ExtendedEvent) => (
          <Grid item key={event.id} md={4} sm={6} xs={12}>
            <AdminEvent event={event} />
          </Grid>
        ))}
        <Grid item md={4} sm={6} xs={12}>
          <Button fullWidth onClick={handleOpenNewEventModal} startIcon={<AddIcon />} variant='contained'>
            Nytt arrangement
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Players;
