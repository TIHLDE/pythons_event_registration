import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { useState } from 'react';

import ConfirmModal from 'components/ConfirmModal';
import { ExtendedEvent } from 'components/Event';
import EventModal from 'components/EventModal';

export type AdminEventProps = {
  event: ExtendedEvent;
};

const AdminEvent = ({ event }: AdminEventProps) => {
  const [updateEventModal, setUpdateEventModal] = useState(false);
  const handleUpdateEventModal = () => setUpdateEventModal(true);
  const handleCloseUpdateEventModal = () => setUpdateEventModal(false);

  const router = useRouter();

  const deleteEvent = () => {
    axios.delete(`/api/events/${event.id}`).then(() => {
      router.replace(router.asPath);
    });
  };
  const type =
    event.eventTypeSlug === 'trening'
      ? { name: 'Trening', color: '#0094FF' }
      : event.eventTypeSlug === 'kamp'
      ? { name: 'Kamp', color: '#0FDC61' }
      : { name: 'Sosialt', color: '#FF00C7' };
  return (
    <Box gap={1} sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', p: 2, backgroundColor: '#3A2056', border: '1px solid white', borderRadius: 1 }}>
      <Typography fontWeight={'bold'} variant='body1'>
        Type
      </Typography>
      <Chip label={type.name} sx={{ backgroundColor: type.color }} />
      {event.title && (
        <>
          <Typography fontWeight={'bold'} variant='body1'>
            Tittel
          </Typography>
          <Typography variant='body1'>{event.title}</Typography>
        </>
      )}
      {event.team && (
        <>
          <Typography fontWeight={'bold'} variant='body1'>
            Lag
          </Typography>
          <Typography variant='body1'>{event.team.name}</Typography>
        </>
      )}
      {event.match && (
        <>
          <Typography fontWeight={'bold'} variant='body1'>
            Motstander
          </Typography>
          <Typography variant='body1'>{event.match.opponent}</Typography>
        </>
      )}
      <Typography fontWeight={'bold'} variant='body1'>
        Dato
      </Typography>
      <Typography variant='body1'>
        {format(new Date(event.time), 'EEEE - dd.MM', {
          locale: nb,
        })}
      </Typography>
      <Typography fontWeight={'bold'} variant='body1'>
        Tid
      </Typography>
      <Typography variant='body1'>{format(new Date(event.time), 'HH:mm')}</Typography>
      <Typography fontWeight={'bold'} variant='body1'>
        Sted
      </Typography>
      <Typography variant='body1'>{event.location}</Typography>
      <ConfirmModal
        color='error'
        description='Er du sikker på at du vil slette arrangementet?'
        onConfirm={() => deleteEvent()}
        size='small'
        title='Slett arrangement'>
        Slett
      </ConfirmModal>
      <Button onClick={handleUpdateEventModal} size='small' variant='outlined'>
        Endre
      </Button>
      {updateEventModal && <EventModal event={event} handleClose={handleCloseUpdateEventModal} open={updateEventModal} title='Endre arrangement' />}
    </Box>
  );
};

export default AdminEvent;
