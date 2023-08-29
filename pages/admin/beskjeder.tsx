import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { prisma } from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';

import AdminMessage, { ExtendedNotification } from 'components/AdminMessage';
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
        <Typography variant='h1'>Beskjeder</Typography>
        <Button color='secondary' component={Link} href='/admin' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
          Til admin
        </Button>
      </Stack>
      <Divider />
      <Typography sx={{ whiteSpace: 'break-spaces' }} variant='body1'>
        {`Beskjeder vises på forsiden frem til tidspunktet du angir. Det vil stå hvem som har skrevet beskjeden. Beskjeder kan både endres og slettes etter publisering.`}
      </Typography>
      <Divider />
      <Button disabled={newMessage} onClick={() => setNewMessage(true)} variant='contained'>
        Opprett ny beskjed
      </Button>
      {newMessage && <NewMessage handleClose={handleClose} />}
      {messages.length ? (
        messages.map((notification: ExtendedNotification) => <AdminMessage key={notification.id} notification={notification} />)
      ) : (
        <Typography>Ingen aktive beskjeder</Typography>
      )}
    </Stack>
  );
};

export default Messages;
