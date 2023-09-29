'use client';

import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { EventType } from '@prisma/client';
import axios from 'axios';
import { format, isPast } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ExtendedEvent } from 'functions/event';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { eventTypesMap } from 'utils';

import ConfirmModal from 'components/ConfirmModal';
import EventModal from 'components/events/EventModal';
import MatchModal from 'components/events/MatchModal';

export type AdminEventProps = {
  event: ExtendedEvent;
};

const AdminEvent = ({ event }: AdminEventProps) => {
  const theme = useTheme();
  const [updateEventModal, setUpdateEventModal] = useState(false);
  const handleUpdateEventModal = () => setUpdateEventModal(true);
  const handleCloseUpdateEventModal = () => setUpdateEventModal(false);

  const router = useRouter();

  const deleteEvent = () => {
    axios.delete(`/api/events/${event.id}`).then(() => {
      router.refresh();
    });
  };

  const type = { name: eventTypesMap[event.eventType].label, background: theme.palette.background[event.eventType] };

  return (
    <Box
      gap={1}
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        p: 2,
        background: type.background,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      }}>
      <Typography fontWeight={'bold'} variant='body1'>
        Type
      </Typography>
      <Chip label={type.name} sx={{ bgcolor: 'background.paper' }} />
      {(event.eventType === EventType.MATCH || event.team) && (
        <>
          <Typography fontWeight={'bold'} variant='body1'>
            Lag
          </Typography>
          <Typography variant='body1'>{event.team?.name ?? '⚠️ Mangler lag ⚠️'}</Typography>
        </>
      )}
      {event.title && (
        <>
          <Typography fontWeight='bold' variant='body1'>
            {event.eventType === EventType.MATCH ? 'Mot' : 'Tittel'}
          </Typography>
          <Typography variant='body1'>{event.title}</Typography>
        </>
      )}
      <Typography fontWeight={'bold'} variant='body1'>
        Dato
      </Typography>
      <Typography sx={{ textTransform: 'capitalize' }} variant='body1'>
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
      {event.match && isPast(new Date(event.time)) && (
        <>
          <Divider sx={{ my: 1, gridColumn: 'span 2' }} />
          <MatchModal event={event} isAdmin sx={{ gridColumn: 'span 2' }} />
          <Divider sx={{ my: 1, gridColumn: 'span 2' }} />
        </>
      )}
      <ConfirmModal
        color='error'
        description='Er du sikker på at du vil slette arrangementet?'
        onConfirm={() => deleteEvent()}
        size='small'
        title='Slett arrangement'>
        Slett
      </ConfirmModal>
      <Button color='secondary' onClick={handleUpdateEventModal} size='small' variant='outlined'>
        Endre
      </Button>
      {updateEventModal && <EventModal event={event} handleClose={handleCloseUpdateEventModal} open={updateEventModal} title='Endre arrangement' />}
    </Box>
  );
};

export default AdminEvent;
