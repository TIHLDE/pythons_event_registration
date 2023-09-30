'use client';

import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { MdDelete, MdEdit } from 'react-icons/md';

import NewMessage from 'components/messages/NewMessage';

export type ExtendedNotification = Prisma.NotificationGetPayload<{
  include: {
    author: true;
  };
}>;

export type AlertMessageProps = {
  notification: ExtendedNotification;
  isAdmin?: boolean;
};

export const AlertMessage = ({ notification, isAdmin }: AlertMessageProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const deleteMessage = async () => {
    await axios.delete(`/api/notification/${notification.id}`);
    router.refresh();
  };

  return (
    <Card className='border-1 border-solid border-yellow-500 p-2 dark:bg-yellow-900' fullWidth shadow='sm'>
      <CardBody className='gap-2'>
        {isOpen ? (
          <NewMessage alwaysShow handleClose={onClose} notification={notification} />
        ) : (
          <>
            <p className='text-md'>{notification.message}</p>
            <p className='text-sm'>- {notification.author.name}</p>
            {isAdmin && (
              <>
                <p className='text-sm italic'>Utløper {format(new Date(notification.expiringDate), 'dd.MM.yy HH:mm')}</p>
                <div className='flex gap-2'>
                  <Button color='primary' isIconOnly onClick={onOpen}>
                    <MdEdit className='h-6 w-6' />
                  </Button>
                  <Button color='danger' isIconOnly onClick={deleteMessage} variant='faded'>
                    <MdDelete className='h-6 w-6' />
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};
