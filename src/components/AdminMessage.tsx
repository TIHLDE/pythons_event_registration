import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Alert, IconButton, Stack, Typography } from '@mui/material';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useState } from 'react';

import NewMessage from 'components/NewMessage';

export type ExtendedNotification = Prisma.NotificationGetPayload<{
  include: {
    author: true;
  };
}>;

type AdminMessageProps = {
  notification: ExtendedNotification;
};

const AdminMessage = ({ notification }: AdminMessageProps) => {
  const [editMessage, setEditMessage] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    setEditMessage(true);
  };

  const handleClose = () => {
    setEditMessage(false);
  };

  const deleteMessage = async () => {
    await axios.delete(`/api/notification/${notification.id}`).then(() => {
      router.replace(router.asPath);
    });
  };

  if (editMessage) {
    return <NewMessage handleClose={handleClose} notification={notification} />;
  }

  return (
    <Alert severity='warning' variant='outlined'>
      <Typography gutterBottom variant='body1'>
        {notification.message}
      </Typography>
      <Typography variant='body2'>Skrevet av {notification.author.name}</Typography>
      <Typography variant='body2'>Utløper {format(new Date(notification.expiringDate), 'dd.MM.yy HH:mm')}</Typography>
      <Stack direction='row' spacing={1}>
        <IconButton color='primary' onClick={handleToggle}>
          <EditIcon />
        </IconButton>
        <IconButton color='primary' onClick={deleteMessage}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </Alert>
  );
};

export default AdminMessage;
