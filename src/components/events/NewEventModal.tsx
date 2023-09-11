'use client';

import AddIcon from '@mui/icons-material/AddRounded';
import { Button } from '@mui/material';
import { useState } from 'react';

import EventModal from 'components/events/EventModal';

export const NewEventModal = () => {
  const [newEventModal, setNewEventModal] = useState(false);
  return (
    <>
      <Button fullWidth onClick={() => setNewEventModal(true)} startIcon={<AddIcon />} variant='contained'>
        Nytt arrangement
      </Button>
      {newEventModal && <EventModal handleClose={() => setNewEventModal(false)} open={newEventModal} title={'Nytt arrangement'} />}
    </>
  );
};
