import { Divider, Stack, Typography } from '@mui/material';
import { prisma } from 'lib/prisma';

import AdminMessage from 'components/messages/AdminMessage';
import NewMessage from 'components/messages/NewMessage';

const getData = async () => {
  const messages = await prisma.notification.findMany({
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

  return { messages };
};

const Messages = async () => {
  const { messages } = await getData();
  return (
    <Stack direction='column' gap={1}>
      <Divider />
      <Typography sx={{ whiteSpace: 'break-spaces' }} variant='body1'>
        {`Beskjeder vises på forsiden frem til tidspunktet du angir. Det vil stå hvem som har skrevet beskjeden. Beskjeder kan både endres og slettes etter publisering.`}
      </Typography>
      <Divider />
      <NewMessage />
      {messages.length ? (
        messages.map((notification) => <AdminMessage key={notification.id} notification={notification} />)
      ) : (
        <Typography>Ingen aktive beskjeder</Typography>
      )}
    </Stack>
  );
};

export default Messages;
