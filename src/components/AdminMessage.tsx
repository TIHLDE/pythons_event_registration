import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { INotification } from 'types';

import NewMessage from 'components/NewMessage';

type AdminMessageProps = {
  notification: INotification;
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
  return (
    <>
      {editMessage ? (
        <Grid item xs={12}>
          <NewMessage handleClose={handleClose} notification={notification} />
        </Grid>
      ) : (
        <>
          <Grid item sm={3} xs={12}>
            <Typography variant='body2'>{notification.message}</Typography>
          </Grid>
          <Grid item sm={3} xs={12}>
            <Typography variant='body2'>{notification.author.name}</Typography>
          </Grid>
          <Grid item sm={3} xs={12}>
            <Typography variant='body2'>{format(new Date(notification.expiringDate), 'dd.MM.yy HH:mm')}</Typography>
          </Grid>
          <Grid item sm={3} xs={12}>
            <Stack direction='row' spacing={1}>
              <IconButton color='primary' onClick={handleToggle}>
                <EditIcon />
              </IconButton>
              <IconButton color='primary' onClick={deleteMessage}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Grid>
        </>
      )}
    </>
  );
};

export default AdminMessage;
