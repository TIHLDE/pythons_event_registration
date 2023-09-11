'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Alert, IconButton, Stack, Typography } from '@mui/material';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import NewMessage from 'components/messages/NewMessage';

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
    await axios.delete(`/api/notification/${notification.id}`);
    router.refresh();
  };

  if (editMessage) {
    return <NewMessage alwaysShow handleClose={handleClose} notification={notification} />;
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