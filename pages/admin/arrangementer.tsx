import AddIcon from '@mui/icons-material/Add';
import { Button, ButtonBase, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';

import { IEvent } from 'types';

import AdminEvent from 'components/AdminEvent';
import EventModal from 'components/EventModal';

export const getServerSideProps: GetServerSideProps = async () => {
  const today = new Date();
  const eventsQuery = await prisma.event.findMany({
    where: {
      time: {
        gte: today,
      },
    },
    orderBy: {
      time: 'asc',
    },
  });
  const events = JSON.parse(safeJsonStringify(eventsQuery)) as Array<IEvent>;

  return { props: { events } };
};

const Players: NextPage = ({ events }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [newEventModal, setNewEventModal] = useState(false);
  const handleOpenNewEventModal = () => setNewEventModal(true);
  const handleCloseNewEventModal = () => setNewEventModal(false);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Arrangementer - Pythons</title>
      </Head>
      <Button onClick={() => router.push('/admin')}>Tilbake til admin-side</Button>
      {newEventModal && <EventModal handleClose={handleCloseNewEventModal} open={newEventModal} title={'Nytt arrangement'} />}
      <Grid container spacing={4}>
        {events.map((event: IEvent) => (
          <Grid item key={event.id} md={3} sm={4} xs={12}>
            <AdminEvent event={event} />
          </Grid>
        ))}
        <Grid item md={3} sm={4} xs={12}>
          <ButtonBase onClick={handleOpenNewEventModal}>
            <Stack direction={'column'}>
              <AddIcon color='secondary' fontSize='large' />
              <Typography>Nytt arrangement</Typography>
            </Stack>
          </ButtonBase>
        </Grid>
      </Grid>
    </>
  );
};

export default Players;
