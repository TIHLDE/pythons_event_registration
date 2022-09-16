import { Box, Button, Dialog, Divider, Stack, StackProps, TextField, Typography } from '@mui/material';
import { Match, Prisma } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import MatchEvents from 'components/MatchEvents';

export type MatchModalProps = StackProps & {
  isAdmin?: boolean;
  event: Prisma.EventGetPayload<{
    include: {
      type: true;
      team: true;
      match: true;
    };
  }>;
};

type FormDataProps = Pick<Match, 'homeGoals' | 'awayGoals'>;

const MatchModal = ({ event, isAdmin = false, ...props }: MatchModalProps) => {
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
      router.replace(router.asPath);
    }
    setOpen(false);
    setShouldRefreshOnClose(false);
  };

  const onSubmit = async (data: FormDataProps) => axios.put(`/api/matches/${event.match?.id}`, { data }).then(onUpdate);

  return (
    <>
      <Stack gap={1} {...props}>
        {event.match?.result ? (
          <>
            <Typography sx={{ display: 'flex', gap: 1 }} variant='h2'>
              <Box component='span' sx={{ flex: 1, textAlign: 'right' }}>
                {event.match.homeGoals}
              </Box>
              -
              <Box component='span' sx={{ flex: 1, textAlign: 'left' }}>
                {event.match.awayGoals}
              </Box>
            </Typography>
            <Typography sx={{ display: 'flex', gap: 1 }} variant='body2'>
              <Box component='span' sx={{ flex: 1, textAlign: 'right' }}>
                {event.team?.name}
              </Box>
              -
              <Box component='span' sx={{ flex: 1, textAlign: 'left' }}>
                {event.title}
              </Box>
            </Typography>
          </>
        ) : (
          <Typography align='center' variant='body2'>
            Denne kampen mangler registrering av resultat og hendelser
          </Typography>
        )}
        {(event.match?.result || isAdmin) && (
          <Button fullWidth onClick={() => setOpen(true)}>
            {isAdmin ? 'Rediger kampdetaljer' : 'Se kampdetaljer'}
          </Button>
        )}
      </Stack>
      <Dialog onClose={handleClose} open={open} sx={{ '& .MuiDialog-paper': { width: '100%', maxWidth: 500, border: '2px solid #ffffff', p: 4 } }}>
        <Stack gap={1}>
          <Typography variant='h2'>{`${event.team?.name} ${event.match?.homeGoals} - ${event.match?.awayGoals} ${event.title}`}</Typography>
          {isAdmin && (
            <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)}>
              <Stack direction='row' gap={1} sx={{ mt: 1 }}>
                <Controller
                  control={control}
                  name='homeGoals'
                  render={({ field }) => (
                    <TextField
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
                    <TextField inputMode='numeric' label={`Mål av ${event.title}`} placeholder={`Mål av ${event.title}`} required {...field} />
                  )}
                />
              </Stack>
              <Button type='submit' variant='contained'>
                Lagre resultat
              </Button>
              <Divider />
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
