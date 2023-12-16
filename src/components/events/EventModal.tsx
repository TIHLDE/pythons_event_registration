'use client';

import { Button } from '@nextui-org/button';
import { Input, Textarea } from '@nextui-org/input';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/modal';
import { Select, SelectItem } from '@nextui-org/select';
import { Event, EventType } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { setMinutes } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { ExtendedEvent } from '~/functions/event';

import { useTeams } from '~/hooks/useQuery';

import { eventTypesList } from '~/utils';
import { MIN_DATE } from '~/values';

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
  description: Event['description'];
};

const dateTimeFormat = "yyyy-MM-dd'T'HH:mm";

export const EventModal = ({ event, open, handleClose, title }: EventModalProps) => {
  const { handleSubmit, control, watch } = useForm<FormDataProps>({
    defaultValues: {
      eventType: event?.eventType ?? '',
      title: event?.title ?? '',
      time: event && event.time ? format(new Date(event.time), dateTimeFormat) : format(setMinutes(new Date(), 0), dateTimeFormat),
      location: event?.location ?? '',
      team: event?.teamId ?? null,
      description: event?.description ?? '',
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
                isRequired
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
              render={({ field }) => <Input isRequired label={watchEventType === EventType.MATCH ? 'Motstander' : 'Tittel'} variant='faded' {...field} />}
            />
          )}
          {watchEventType === EventType.MATCH && teams.length > 0 && (
            <Controller
              control={control}
              name='team'
              render={({ field: { onChange, value } }) => (
                <Select
                  isRequired
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
            render={({ field }) => (
              <Input isRequired label='Tidspunkt' min={MIN_DATE} placeholder='Tidspunkt' type='datetime-local' variant='faded' {...field} />
            )}
          />
          <Controller control={control} name='location' render={({ field }) => <Input isRequired label='Sted' variant='faded' {...field} />} />
          <Controller
            control={control}
            name='description'
            render={({ field }) => <Textarea label='Beskrivelse' maxRows={5} minRows={2} variant='faded' {...field} />}
          />
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
