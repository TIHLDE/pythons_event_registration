import { Alert } from '@mui/material';
import Typography from '@mui/material/Typography';
import { getActiveNotifications } from 'functions/getActiveNotifications';
import { Suspense } from 'react';

import { ExtendedNotification } from 'components/messages/AdminMessage';

type AlertMessageProps = {
  notification: ExtendedNotification;
};

const AlertMessage = ({ notification }: AlertMessageProps) => {
  return (
    <Alert severity='warning' variant='outlined'>
      <Typography gutterBottom variant='body1'>
        {notification.message}
      </Typography>
      <Typography variant='body2'>- {notification.author.name}</Typography>
    </Alert>
  );
};

export const ActiveMessages = async () => {
  const notifications = await getActiveNotifications();
  return (
    <Suspense fallback={null}>
      {notifications.map((notification: ExtendedNotification) => (
        <AlertMessage key={notification.id} notification={notification} />
      ))}
    </Suspense>
  );
};
