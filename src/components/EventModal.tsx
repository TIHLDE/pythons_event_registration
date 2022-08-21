import { FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { format } from 'date-fns';
import { setMinutes } from 'date-fns';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { fetcher } from 'utils';

import { IEvent, IEventType } from 'types';

export type EventModalProps = {
  event?: IEvent;
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
};

const EventModal = ({ event, open, handleClose, title }: EventModalProps) => {
  const dateTimeFormat = "yyyy-MM-dd'T'HH:mm";
  const { handleSubmit, control, watch } = useForm<FormDataProps>({
    defaultValues: {
      eventTypeSlug: event?.eventTypeSlug || '',
      title: event?.title || '',
      time: event && event.time ? format(new Date(event.time), dateTimeFormat) : format(setMinutes(new Date(), 0), dateTimeFormat),
      location: event?.location || '',
    },
  });
  const { data: eventTypes } = useSWR('/api/eventType', fetcher);
  const watchEventType: string = watch('eventTypeSlug');
  const router = useRouter();

  const onSubmit = async (formData: FormDataProps) => {
    const data = {
      ...formData,
      time: new Date(formData.time),
    };
    if (event) {
      await axios.put(`/api/events/${event.id}`, { data: data }).then(() => {
        router.replace(router.asPath);
        handleClose();
      });
    } else {
      await axios.post('/api/events', { data: data }).then(() => {
        router.replace(router.asPath);
        handleClose();
      });
    }
  };

  return (
    <Modal onClose={handleClose} open={open}>
      <Stack
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '1px solid white',
          p: 2,
          borderRadius: 1,
        }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography variant='h2'>{title}</Typography>
            <Controller
              control={control}
              name='eventTypeSlug'
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='selectType-label'>Type</InputLabel>
                  <Select id='selectType' labelId='selectType-label' required {...field} label='Type'>
                    {eventTypes?.map((eventType: IEventType) => (
                      <MenuItem key={eventType.slug} value={eventType.slug}>
                        {eventType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            {watchEventType && watchEventType !== 'trening' && (
              <Controller control={control} name='title' render={({ field }) => <TextField label={'Tittel'} placeholder='Tittel' required {...field} />} />
            )}
            <Controller control={control} name='time' render={({ field }) => <TextField label={'Tidspunkt'} required type='datetime-local' {...field} />} />
            <Controller control={control} name='location' render={({ field }) => <TextField label={'Sted'} placeholder='Sted' required {...field} />} />
            <Button type='submit' variant='contained'>
              {event ? 'Oppdater' : 'Opprett'}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
};

export default EventModal;
