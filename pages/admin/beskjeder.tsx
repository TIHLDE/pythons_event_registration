import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { prisma } from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';

import { INotification } from 'types';

import AdminMessage from 'components/AdminMessage';
import NewMessage from 'components/NewMessage';

export const getServerSideProps: GetServerSideProps = async () => {
  const messagesQuery = await prisma.notification.findMany({
    where: {
      expiringDate: {
        gt: new Date(),
      },
    },
    include: {
      author: true,
    },
    orderBy: {
      expiringDate: 'asc',
    },
  });

  const messages = JSON.parse(safeJsonStringify(messagesQuery));

  return { props: { messages } };
};

const Messages: NextPage = ({ messages }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [newMessage, setNewMessage] = useState(false);

  const handleClose = () => {
    setNewMessage(false);
  };
  return (
    <Stack direction='column' spacing={2} sx={{ marginTop: 2 }}>
      <Button disabled={newMessage} onClick={() => setNewMessage(true)}>
        Opprett ny beskjed
      </Button>
      {newMessage && <NewMessage handleClose={handleClose} />}
      {messages.length ? (
        <Grid container>
          <Grid item xs={3}>
            <Typography fontWeight={'bold'}>Beskjeder:</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography fontWeight={'bold'}>Forfatter:</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography fontWeight={'bold'}>Utgår:</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography fontWeight={'bold'}>Handlinger:</Typography>
          </Grid>
          {messages.map((notification: INotification) => (
            <AdminMessage key={notification.id} notification={notification} />
          ))}
        </Grid>
      ) : (
        <Typography>Ingen å vise</Typography>
      )}
    </Stack>
  );
};

export default Messages;
