'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { Notification } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

type FormDataProps = {
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expiringDate: any;
};

export type NewMessageProps = {
  alwaysShow?: boolean;
  handleClose?: () => void;
  notification?: Notification;
};

const NewMessage = ({ alwaysShow, notification, handleClose }: NewMessageProps) => {
  const router = useRouter();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const dateTimeFormat = "yyyy-MM-dd'T'HH:mm";
  const { control, reset, handleSubmit } = useForm<FormDataProps>({
    defaultValues: {
      expiringDate: format(notification ? new Date(notification.expiringDate) : new Date(), dateTimeFormat),
      message: notification?.message ?? '',
    },
  });
  const onSubmit = async (formData: FormDataProps) => {
    const data = {
      message: formData.message,
      expiringDate: formData.expiringDate,
    };

    if (notification) {
      await axios.put(`/api/notification/${notification.id}`, { data: data });
    } else {
      await axios.post('/api/notification', { data: data });
    }
    router.refresh();
    reset();
    onClose();
  };

  const handleCloseClick = () => {
    onClose();
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <>
      {!alwaysShow && (
        <Button color='primary' isDisabled={isOpen} onClick={onOpen} variant='solid'>
          Opprett ny beskjed
        </Button>
      )}
      {(alwaysShow || isOpen) && (
        <form className='flex flex-col items-center gap-2 py-2 md:flex-row' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name='message'
            render={({ field }) => <Input className='flex-1' isRequired label='Beskjed' variant='faded' {...field} />}
          />
          <Controller
            control={control}
            name='expiringDate'
            render={({ field }) => (
              <Input className='w-fit' isRequired label='Utløper' placeholder='Utløper' type='datetime-local' variant='faded' {...field} />
            )}
          />
          <Button color='primary' type='submit' variant='solid'>
            {notification ? 'Oppdater' : 'Opprett'}
          </Button>
          <Button color='danger' onClick={handleCloseClick} variant='light'>
            Avbryt
          </Button>
        </form>
      )}
    </>
  );
};

export default NewMessage;
