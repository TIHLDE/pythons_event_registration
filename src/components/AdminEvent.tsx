import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { IEvent } from 'types';

import ConfirmModal from 'components/ConfirmModal';
import EventModal from 'components/EventModal';

export type AdminEventProps = {
  event: IEvent;
};

const AdminEvent = ({ event }: AdminEventProps) => {
  const [updateEventModal, setUpdateEventModal] = useState(false);
  const handleUpdateEventModal = () => setUpdateEventModal(true);
  const handleCloseUpdateEventModal = () => setUpdateEventModal(false);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const handleCloseConfirmModal = () => setOpenConfirmModal(false);

  const router = useRouter();

  const deleteEvent = () => {
    axios.delete(`/api/events/${event.id}`).then(() => {
      router.replace(router.asPath);
      handleCloseConfirmModal();
    });
  };
  const type =
    event.eventTypeSlug === 'trening'
      ? { name: 'Trening', color: '#0094FF' }
      : event.eventTypeSlug === 'kamp'
      ? { name: 'Kamp', color: '#0FDC61' }
      : { name: 'Sosialt', color: '#FF00C7' };
  return (
    <Stack spacing={0.5} sx={{ backgroundColor: '#3A2056', border: '1px solid white' }}>
      <Stack direction='row' justifyContent={'space-between'} padding={1}>
        <Typography fontWeight={'bold'} variant='body1'>
          Type
        </Typography>
        <Chip label={type.name} sx={{ backgroundColor: type.color }} />
      </Stack>
      {event.title && (
        <Stack direction='row' justifyContent={'space-between'} padding={1}>
          <Typography fontWeight={'bold'} variant='body1'>
            Tittel
          </Typography>
          <Typography variant='body1'>{event.title}</Typography>
        </Stack>
      )}
      <Stack direction='row' justifyContent={'space-between'} padding={1}>
        <Typography fontWeight={'bold'} variant='body1'>
          Dato
        </Typography>
        <Typography variant='body1'>
          {format(new Date(event.time), 'EEEE - dd.MM', {
            locale: nb,
          })}
        </Typography>
      </Stack>
      <Stack direction='row' justifyContent={'space-between'} padding={1}>
        <Typography fontWeight={'bold'} variant='body1'>
          Tid
        </Typography>
        <Typography variant='body1'>{format(new Date(event.time), 'HH:mm')}</Typography>
      </Stack>
      <Stack direction='row' justifyContent={'space-between'} padding={1}>
        <Typography fontWeight={'bold'} variant='body1'>
          Sted
        </Typography>
        <Typography variant='body1'>{event.location}</Typography>
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Button onClick={handleUpdateEventModal} size='small' sx={{ textAlign: 'left', justifyContent: 'flex-start' }}>
          Endre
        </Button>
        <Button color='error' onClick={() => setOpenConfirmModal(true)} size='small' sx={{ textAlign: 'left', justifyContent: 'flex-start' }}>
          Slett
        </Button>
      </Stack>
      {updateEventModal && <EventModal event={event} handleClose={handleCloseUpdateEventModal} open={updateEventModal} title='Endre arrangement' />}
      {openConfirmModal && (
        <ConfirmModal handleClose={handleCloseConfirmModal} onConfirm={() => deleteEvent()} open={openConfirmModal} title='Slett arrangement' />
      )}
    </Stack>
  );
};

export default AdminEvent;
