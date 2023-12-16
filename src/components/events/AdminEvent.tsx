'use client';

import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { Divider } from '@nextui-org/divider';
import { useDisclosure } from '@nextui-org/react';
import { EventType } from '@prisma/client';
import axios from 'axios';
import { format, isPast } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { ExtendedEvent } from '~/functions/event';

import { ConfirmModal } from '~/components/ConfirmModal';
import { EventModal } from '~/components/events/EventModal';
import { MatchModal } from '~/components/events/MatchModal';

import { eventTypeBgGradient, eventTypesMap } from '~/utils';

export type AdminEventProps = {
  event: ExtendedEvent;
};

const AdminEvent = ({ event }: AdminEventProps) => {
  const [isCreatingMatch, setIsCreatingMatch] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { refresh } = useRouter();

  const deleteEvent = useCallback(async () => {
    await axios.delete(`/api/events/${event.id}`);
    refresh();
  }, [event, refresh]);

  const createMatch = useCallback(async () => {
    setIsCreatingMatch(true);
    await axios.post(`/api/matches`, { eventId: event.id });
    refresh();
  }, [event, refresh]);

  return (
    <Card className={`grid grid-cols-[auto_1fr] gap-2 self-start rounded-md p-4 ${eventTypeBgGradient[event.eventType]}`}>
      <p className='text-md font-bold'>Type</p>
      <Chip color='secondary' variant='faded'>
        {eventTypesMap[event.eventType].label}
      </Chip>
      {(event.eventType === EventType.MATCH || event.team) && (
        <>
          <p className='text-md font-bold'>Lag</p>
          <p className='text-md'>{event.team?.name ?? '⚠️ Mangler lag ⚠️'}</p>
        </>
      )}
      {event.title && (
        <>
          <p className='text-md font-bold'>{event.eventType === EventType.MATCH ? 'Mot' : 'Tittel'}</p>
          <p className='text-md'>{event.title}</p>
        </>
      )}
      <p className='text-md font-bold'>Dato</p>
      <p className='text-md capitalize'>
        {format(new Date(event.time), 'EEEE - dd.MM', {
          locale: nb,
        })}
      </p>
      <p className='text-md font-bold'>Tid</p>
      <p className='text-md'>{format(new Date(event.time), 'HH:mm')}</p>
      <p className='text-md font-bold'>Sted</p>
      <p className='text-md'>{event.location}</p>
      {event.description && (
        <>
          <p className='text-md font-bold'>Beskrivelse</p>
          <p className='text-md line-clamp-1'>{event.description}</p>
        </>
      )}
      {event.eventType === EventType.MATCH && isPast(new Date(event.time)) && (
        <>
          <Divider className='col-span-2 my-2' />
          {event.match ? (
            <MatchModal className='col-span-2' event={event} isAdmin />
          ) : (
            <Button className='col-span-2' fullWidth isLoading={isCreatingMatch} onClick={createMatch} variant='light'>
              {`Opprett${isCreatingMatch ? 'er' : ''} kampresultat`}
            </Button>
          )}
          <Divider className='col-span-2 my-2' />
        </>
      )}
      <ConfirmModal description='Er du sikker på at du vil slette arrangementet?' onConfirm={() => deleteEvent()} size='sm' title='Slett arrangement'>
        Slett
      </ConfirmModal>
      <Button color='secondary' onClick={onOpen} size='sm' variant='bordered'>
        Endre
      </Button>
      {isOpen && <EventModal event={event} handleClose={onClose} open={isOpen} title='Endre arrangement' />}
    </Card>
  );
};

export default AdminEvent;
