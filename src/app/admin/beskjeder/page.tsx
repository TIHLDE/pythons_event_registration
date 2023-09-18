import { Divider, Stack, Typography } from '@mui/material';
import { getActiveNotifications } from 'functions/getActiveNotifications';

import AdminMessage from 'components/messages/AdminMessage';
import NewMessage from 'components/messages/NewMessage';

const Messages = async () => {
  const messages = await getActiveNotifications();
  return (
    <Stack direction='column' gap={1}>
      <Divider />
      <Typography sx={{ whiteSpace: 'break-spaces' }} variant='body1'>
        Beskjeder vises på forsiden frem til tidspunktet du angir. Det vil stå hvem som har skrevet beskjeden. Beskjeder kan både endres og slettes etter
        publisering.
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
