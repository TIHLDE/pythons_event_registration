import { Suspense } from 'react';

import { getActiveNotifications } from '~/functions/getActiveNotifications';

import { ExtendedNotification } from '~/components/messages/AlertMessage';
import { AlertMessage } from '~/components/messages/AlertMessage';

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
