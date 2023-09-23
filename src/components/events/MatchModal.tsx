'use client';

import { Close } from '@mui/icons-material';
import { Box, Button, ButtonProps, Dialog, IconButton, Stack, TextField, Typography } from '@mui/material';
import { Match, Prisma } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import MatchEvents from 'components/events/MatchEvents';

export type MatchModalProps = ButtonProps & {
  isAdmin?: boolean;
  event: Prisma.EventGetPayload<{
    include: {
      team: true;
      match: true;
    };
  }>;
};

type FormDataProps = Pick<Match, 'homeGoals' | 'awayGoals'>;

const MatchModal = ({ event, isAdmin = false, sx, ...props }: MatchModalProps) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [shouldRefreshOnClose, setShouldRefreshOnClose] = useState(false);

  const { handleSubmit, control } = useForm<FormDataProps>({
    defaultValues: {
      homeGoals: event.match?.homeGoals || 0,
      awayGoals: event.match?.awayGoals || 0,
    },
  });

  const onUpdate = () => setShouldRefreshOnClose(true);

  const handleClose = () => {
    if (shouldRefreshOnClose) {
      router.refresh();
    }
    setOpen(false);
    setShouldRefreshOnClose(false);
  };

  const onSubmit = async (data: FormDataProps) => axios.put(`/api/matches/${event.match?.id}`, { data }).then(onUpdate);

  return (
    <>
      <Button fullWidth onClick={() => setOpen(true)} sx={{ color: 'inherit', textTransform: 'none', ...sx }} {...props}>
        <Typography component='span' sx={{ width: '100%', display: 'flex', gap: 1, alignItems: 'center' }} variant='body1'>
          <Box component='span' sx={{ flex: 1, py: 0.25, textAlign: 'right' }}>
            {event.team?.name}
          </Box>
          <Box component='span' sx={{ display: 'flex', gap: 0.5, py: 0.25, px: 0.5, borderRadius: 0.5, bgcolor: '#ffffff44', fontWeight: 'bold' }}>
            <Box component='span' sx={{ flex: 1, textAlign: 'right' }}>
              {event.match?.homeGoals ?? '?'}
            </Box>
            -
            <Box component='span' sx={{ flex: 1, textAlign: 'left' }}>
              {event.match?.awayGoals ?? '?'}
            </Box>
          </Box>
          <Box component='span' sx={{ flex: 1, py: 0.25, textAlign: 'left' }}>
            {event.title}
          </Box>
        </Typography>
      </Button>
      <Dialog onClose={handleClose} open={open} sx={{ '& .MuiPaper-root': { background: ({ palette }) => palette.background[event.eventType] } }}>
        <Stack gap={1}>
          <Stack direction='row' justifyContent='space-between' spacing={2} sx={{ alignItems: 'center' }}>
            <Typography variant='h2'>{`${event.team?.name} ${event.match?.homeGoals} - ${event.match?.awayGoals} ${event.title}`}</Typography>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Stack>
          <Typography sx={{ textTransform: 'capitalize' }} variant='body2'>
            {format(new Date(event.time), "EEEE dd. MMMM yyyy' 'HH:mm", {
              locale: nb,
            })}
          </Typography>
          {isAdmin && (
            <Stack
              component='form'
              gap={1}
              onSubmit={handleSubmit(onSubmit)}
              sx={{ border: (theme) => `1px solid ${theme.palette.divider}`, p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
              <Stack direction='row' gap={1} sx={{ mt: 1 }}>
                <Controller
                  control={control}
                  name='homeGoals'
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      inputMode='numeric'
                      label={`Mål av oss (${event.team?.name})`}
                      placeholder={`Mål av oss (${event.team?.name})`}
                      required
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name='awayGoals'
                  render={({ field }) => (
                    <TextField fullWidth inputMode='numeric' label={`Mål av ${event.title}`} placeholder={`Mål av ${event.title}`} required {...field} />
                  )}
                />
              </Stack>
              <Button type='submit' variant='contained'>
                Lagre resultat
              </Button>
            </Stack>
          )}
          {isAdmin && <Typography variant='h3'>Hendelser</Typography>}
          <MatchEvents event={event} isAdmin={isAdmin} />
        </Stack>
      </Dialog>
    </>
  );
};

export default MatchModal;
