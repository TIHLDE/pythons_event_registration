import { Dialog, FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { EventType, Team } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { setMinutes } from 'date-fns';
import { useRouter } from 'next/router';
import { ExtendedEvent } from 'queries';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { fetcher } from 'utils';

export type EventModalProps = {
  event?: ExtendedEvent;
  open: boolean;
  handleClose: () => void;
  title: string;
};

type FormDataProps = {
  eventTypeSlug: string;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  time: any;
  location: string;
  team: ExtendedEvent['teamId'];
};

const EventModal = ({ event, open, handleClose, title }: EventModalProps) => {
  const dateTimeFormat = "yyyy-MM-dd'T'HH:mm";
  const { handleSubmit, control, watch } = useForm<FormDataProps>({
    defaultValues: {
      eventTypeSlug: event?.eventTypeSlug || '',
      title: event?.title || '',
      time: event && event.time ? format(new Date(event.time), dateTimeFormat) : format(setMinutes(new Date(), 0), dateTimeFormat),
      location: event?.location || '',
      team: event?.teamId || null,
    },
  });
  const { data: eventTypes } = useSWR('/api/eventType', fetcher);
  const { data: teams } = useSWR<Team[]>('/api/teams', fetcher);
  const watchEventType = watch('eventTypeSlug');
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
    router.replace(router.asPath, undefined, { scroll: false });
    handleClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography variant='h2'>{title}</Typography>
          <Controller
            control={control}
            name='eventTypeSlug'
            render={({ field }) => (
              <FormControl disabled={Boolean(event)} fullWidth>
                <InputLabel id='selectType-label'>Type</InputLabel>
                <Select id='selectType' labelId='selectType-label' required {...field} label='Type'>
                  {eventTypes?.map((eventType: EventType) => (
                    <MenuItem key={eventType.slug} value={eventType.slug}>
                      {eventType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
          {watchEventType !== 'trening' && (
            <Controller
              control={control}
              name='title'
              render={({ field }) => (
                <TextField
                  label={watchEventType === 'kamp' ? 'Motstander' : 'Tittel'}
                  placeholder={watchEventType === 'kamp' ? 'Motstander' : 'Tittel'}
                  required
                  {...field}
                />
              )}
            />
          )}
          {watchEventType === 'kamp' && (
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
