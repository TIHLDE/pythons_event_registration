'use client';

import { Close } from '@mui/icons-material';
import { Button, Dialog, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
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
  title?: Event['title'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  time: any;
  location: Event['location'];
  team: Event['teamId'];
};

const EventModal = ({ event, open, handleClose, title }: EventModalProps) => {
  const dateTimeFormat = "yyyy-MM-dd'T'HH:mm";
  const { handleSubmit, control, watch } = useForm<FormDataProps>({
    defaultValues: {
      eventType: event?.eventType || '',
      title: event?.title || '',
      time: event && event.time ? format(new Date(event.time), dateTimeFormat) : format(setMinutes(new Date(), 0), dateTimeFormat),
      location: event?.location || '',
      team: event?.teamId || null,
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
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Stack direction='row' justifyContent='space-between' spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant='h2'>{title}</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Stack>
          <Controller
            control={control}
            name='eventType'
            render={({ field }) => (
              <FormControl disabled={Boolean(event)} fullWidth>
                <InputLabel id='selectType-label'>Type</InputLabel>
                <Select id='selectType' labelId='selectType-label' required {...field} label='Type'>
                  {eventTypesList.map((eventType) => (
                    <MenuItem key={eventType.type} value={eventType.type}>
                      {eventType.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {watchEventType !== EventType.TRAINING && (
            <Controller
              control={control}
              name='title'
              render={({ field }) => (
                <TextField
                  label={watchEventType === EventType.MATCH ? 'Motstander' : 'Tittel'}
                  placeholder={watchEventType === EventType.MATCH ? 'Motstander' : 'Tittel'}
                  required
                  {...field}
                />
              )}
            />
          )}
          {watchEventType === EventType.MATCH && (
            <FormControl fullWidth>
              <InputLabel id='select-team'>Lag</InputLabel>
              <Controller
                control={control}
                name='team'
                render={({ field: { onChange, value } }) => (
                  <Select label='Lag' onChange={onChange} value={value}>
                    {teams?.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          )}

          <Controller control={control} name='time' render={({ field }) => <TextField label={'Tidspunkt'} required type='datetime-local' {...field} />} />
          <Controller control={control} name='location' render={({ field }) => <TextField label={'Sted'} placeholder='Sted' required {...field} />} />
          <Button type='submit' variant='contained'>
            {event ? 'Oppdater' : 'Opprett'}
          </Button>
        </Stack>
      </form>
    </Dialog>
  );
};

export default EventModal;
