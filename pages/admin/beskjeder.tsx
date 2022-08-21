import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Button, Stack, Typography } from '@mui/material';
import { prisma } from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
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
    <Stack direction='column' gap={1}>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h2'>Beskjeder</Typography>
        <Link href='/admin' passHref>
          <Button component='a' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
            Til admin
          </Button>
        </Link>
      </Stack>
      <Button disabled={newMessage} onClick={() => setNewMessage(true)} variant='contained'>
        Opprett ny beskjed
      </Button>
      {newMessage && <NewMessage handleClose={handleClose} />}
      {messages.length ? (
        messages.map((notification: INotification) => <AdminMessage key={notification.id} notification={notification} />)
      ) : (
        <Typography>Ingen å vise</Typography>
      )}
    </Stack>
  );
};

export default Messages;
