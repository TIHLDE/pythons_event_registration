'use client';

import AddIcon from '@mui/icons-material/AddRounded';
import { Button } from '@nextui-org/button';
import { useDisclosure } from '@nextui-org/use-disclosure';

import EventModal from 'components/events/EventModal';

export const NewEventModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button color='primary' fullWidth onClick={onOpen} startContent={<AddIcon />} variant='solid'>
        Nytt arrangement
      </Button>
      {isOpen && <EventModal handleClose={onClose} open={isOpen} title='Nytt arrangement' />}
    </>
  );
};
