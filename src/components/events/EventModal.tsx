'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Select, SelectItem } from '@nextui-org/select';
import { Event, EventType } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { setMinutes } from 'date-fns';
import { ExtendedEvent } from 'functions/event';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { eventTypesList } from 'utils';

import { useTeams } from 'hooks/useQuery';

export type EventModalProps = {
  event?: ExtendedEvent;
  open: boolean;
  handleClose: () => void;
  title: string;
};

type FormDataProps = {
  eventType: Event['eventType'] | '';
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  time: any;
  location: Event['location'];
  team: Event['teamId'];
};

const dateTimeFormat = "yyyy-MM-dd'T'HH:mm";

const EventModal = ({ event, open, handleClose, title }: EventModalProps) => {
  const { handleSubmit, control, watch } = useForm<FormDataProps>({
    defaultValues: {
      eventType: event?.eventType ?? '',
      title: event?.title ?? '',
      time: event && event.time ? format(new Date(event.time), dateTimeFormat) : format(setMinutes(new Date(), 0), dateTimeFormat),
      location: event?.location ?? '',
      team: event?.teamId ?? null,
    },
  });
  const { data: teams = [] } = useTeams();
  const watchEventType = watch('eventType');
  const router = useRouter();

  const onSubmit = async (formData: FormDataProps) => {
    const data = {
      ...formData,
      time: new Date(formData.time),
      matchId: event?.match?.id,
    };
    if (event) {
      await axios.put(`/api/events/${event.id}`, { data: data });
    } else {
      await axios.post('/api/events', { data: data });
    }
    router.refresh();
    handleClose();
  };

  return (
    <Modal hideCloseButton isOpen={open} onClose={handleClose} scrollBehavior='inside'>
      <ModalContent as='form' onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <Controller
            control={control}
            name='eventType'
            render={({ field: { onChange, value } }) => (
              <Select
                isDisabled={Boolean(event)}
                items={eventTypesList}
                label='Type'
                onChange={(e) => onChange(e.target.value)}
                selectedKeys={new Set(value ? [value] : [])}
                variant='faded'>
                {(eventType) => (
                  <SelectItem key={eventType.type} value={eventType.type}>
                    {eventType.label}
                  </SelectItem>
                )}
              </Select>
            )}
          />
          {watchEventType !== EventType.TRAINING && (
            <Controller
              control={control}
              name='title'
              render={({ field }) => <Input label={watchEventType === EventType.MATCH ? 'Motstander' : 'Tittel'} required variant='faded' {...field} />}
            />
          )}
          {watchEventType === EventType.MATCH && teams.length > 0 && (
            <Controller
              control={control}
              name='team'
              render={({ field: { onChange, value } }) => (
                <Select
                  items={teams}
                  label='Lag'
                  onChange={(e) => onChange(e.target.value)}
                  selectedKeys={new Set(value ? [String(value)] : [])}
                  variant='faded'>
                  {(team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  )}
                </Select>
              )}
            />
          )}

          <Controller
            control={control}
            name='time'
            render={({ field }) => <Input label='Tidspunkt' placeholder='Tidspunkt' required type='datetime-local' variant='faded' {...field} />}
          />
          <Controller control={control} name='location' render={({ field }) => <Input label='Sted' required variant='faded' {...field} />} />
        </ModalBody>
        <ModalFooter>
          <Button color='danger' onPress={handleClose} variant='flat'>
            Avbryt
          </Button>
          <Button color='primary' type='submit'>
            {event ? 'Oppdater' : 'Opprett'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EventModal;
