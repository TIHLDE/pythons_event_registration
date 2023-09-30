'use client';

import { Button } from '@nextui-org/button';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { MdAdd } from 'react-icons/md';

import EventModal from 'components/events/EventModal';

export const NewEventModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button color='primary' fullWidth onClick={onOpen} startContent={<MdAdd className='h-6 w-6' />} variant='solid'>
        Nytt arrangement
      </Button>
      {isOpen && <EventModal handleClose={onClose} open={isOpen} title='Nytt arrangement' />}
    </>
  );
};
