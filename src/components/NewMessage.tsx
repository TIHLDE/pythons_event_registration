import { Button, Stack, TextField } from '@mui/material';
import { Notification } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import router from 'next/router';
import { Controller, useForm } from 'react-hook-form';

import { useUser } from 'hooks/useUser';

type FormDataProps = {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expiringDate: any;
};

type NewMessageProps = {
  handleClose: () => void;
  notification?: Notification;
};

const NewMessage = ({ handleClose, notification }: NewMessageProps) => {
  const { data: user } = useUser();

  const dateTimeFormat = "yyyy-MM-dd'T'HH:mm";
  const { control, reset, handleSubmit } = useForm<FormDataProps>({
    defaultValues: {
      expiringDate: format(notification ? new Date(notification.expiringDate) : new Date(), dateTimeFormat),
      message: notification?.message ?? '',
    },
  });
  const onSubmit = async (formData: FormDataProps) => {
    const data = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      authorId: user!.id,
      message: formData.message,
      expiringDate: formData.expiringDate,
    };

    if (notification) {
      await axios.put(`/api/notification/${notification.id}`, { data: data });
    } else {
      await axios.post('/api/notification', { data: data });
    }
    router.replace(router.asPath, undefined, { scroll: false });
    reset();
    handleClose();
  };
  return (
    <Stack component='form' direction={{ md: 'row' }} gap={1} onSubmit={handleSubmit(onSubmit)} sx={{ py: 1 }}>
      <Controller
        control={control}
        name='message'
        render={({ field }) => <TextField label={'Beskjed'} placeholder='Beskjed' required sx={{ flex: 1 }} variant='outlined' {...field} />}
      />
      <Controller
        control={control}
        name='expiringDate'
        render={({ field }) => <TextField label={'Utløper'} placeholder='Utløper' required type='datetime-local' variant='outlined' {...field} />}
      />
      <Button type='submit' variant='contained'>
        {notification ? 'Oppdater' : 'Opprett'}
      </Button>
      <Button onClick={handleClose}>Avbryt</Button>
    </Stack>
  );
};

export default NewMessage;
