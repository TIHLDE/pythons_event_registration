import { Divider } from '@nextui-org/divider';

import { getActiveNotifications } from '~/functions/getActiveNotifications';

import { AlertMessage } from '~/components/messages/AlertMessage';
import NewMessage from '~/components/messages/NewMessage';

const Messages = async () => {
  const messages = await getActiveNotifications();
  return (
    <div className='flex flex-col gap-2'>
      <Divider />
      <p className='text-md whitespace-break-spaces'>
        Beskjeder vises på forsiden frem til tidspunktet du angir. Det vil stå hvem som har skrevet beskjeden. Beskjeder kan både endres og slettes etter
        publisering.
      </p>
      <Divider />
      <NewMessage />
      {messages.length ? (
        messages.map((notification) => <AlertMessage isAdmin key={notification.id} notification={notification} />)
      ) : (
        <p className='text-md'>Ingen aktive beskjeder</p>
      )}
    </div>
  );
};

export default Messages;
