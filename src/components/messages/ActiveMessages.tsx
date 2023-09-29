import { Card, CardBody } from '@nextui-org/card';
import { getActiveNotifications } from 'functions/getActiveNotifications';
import { Suspense } from 'react';

import { ExtendedNotification } from 'components/messages/AdminMessage';

type AlertMessageProps = {
  notification: ExtendedNotification;
};

const AlertMessage = ({ notification }: AlertMessageProps) => {
  return (
    <Card className='border-1 border-solid border-yellow-500 p-2 dark:bg-yellow-900' fullWidth shadow='sm'>
      <CardBody className='gap-2'>
        <p className='text-md'>{notification.message}</p>
        <p className='text-sm'>- {notification.author.name}</p>
      </CardBody>
    </Card>
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
