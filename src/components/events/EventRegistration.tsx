'use client';

import { Alert, Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { Player, Registrations } from '@prisma/client';
import axios from 'axios';
import { format, formatDistanceToNow, isFuture, isPast, subHours } from 'date-fns';
import { nb } from 'date-fns/locale';
import { ExtendedEvent } from 'functions/event';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useReward } from 'react-rewards';
import { rules } from 'rules';

export type EventRegistrationProps = {
  eventDetails: ExtendedEvent;
  registration?: Registrations;
  player: Player;
};

type FormDataProps = {
  reason?: string;
  registration?: string | number | undefined;
};

const EventRegistration = ({ eventDetails, player, registration }: EventRegistrationProps) => {
  const { reward: willArriveConfetti } = useReward('confetti', 'confetti', { elementCount: 100, elementSize: 15 });
  const { reward: willNotArriveConfetti } = useReward('confetti', 'emoji', { emoji: ['😭', '😢', '💔'], elementCount: 40 });

  const router = useRouter();

  const userHasRegistrated = Boolean(registration);
  const { handleSubmit, control, watch } = useForm<FormDataProps>({
    defaultValues: {
      registration: registration ? (registration.willArrive ? '1' : '0') : '1',
      reason: registration?.reason || '',
    },
  });

  const watchRegistration: number | string | undefined = watch('registration');
  const [openRegistration, setOpenRegistration] = useState(false);
  const onSubmit = useCallback(
    async (formData: FormDataProps) => {
      const data = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        playerId: player!.id,
        eventId: eventDetails.id,
        ...(formData.reason && {
          reason: formData.reason,
        }),
      };
      const willArrive = formData.registration === '1';
      if (userHasRegistrated) {
        await axios.put(`/api/registration/${data.playerId}_${data.eventId}`, { data, willArrive });
      } else {
        await axios.post('/api/registration', { data, willArrive });
      }
      if (willArrive) {
        willArriveConfetti();
      } else {
        willNotArriveConfetti();
      }
      setOpenRegistration(false);
      router.refresh();
    },
    [eventDetails.id, router, player, userHasRegistrated, willArriveConfetti, willNotArriveConfetti],
  );

  const registrationDeadline =
    eventDetails.eventTypeSlug in rules ? subHours(new Date(eventDetails.time), rules[eventDetails.eventTypeSlug].deadlines.signupBefore) : undefined;

  return (
    <>
      {registration && (
        <Typography fontWeight='bold' sx={{ mb: -0.5 }} textAlign='center' variant='body1'>
          {registration.willArrive ? '🤝 Du er påmeldt' : `😥 Du er avmeldt: ${registration.reason}`}
        </Typography>
      )}
      <Box component='span' id='confetti' sx={{ position: 'fixed', bottom: 0, left: '50%', translate: '-50% 0' }} />
      {!eventDetails.teamId || eventDetails.teamId === player?.teamId ? (
        <>
          {!openRegistration ? (
            <>
              {isFuture(new Date(eventDetails.time)) && (
                <Button onClick={() => setOpenRegistration(true)} variant={userHasRegistrated ? 'text' : 'contained'}>
                  {userHasRegistrated ? 'Endre' : 'Registrer'} oppmøte
                </Button>
              )}
              {registrationDeadline !== undefined && (
                <Typography sx={{ mt: -0.5 }} textAlign='center' variant='body2'>
                  {`Påmeldingsfrist ${isPast(registrationDeadline) ? 'var ' : ''}${formatDistanceToNow(registrationDeadline, {
                    locale: nb,
                    addSuffix: true,
                  })} - kl. ${format(registrationDeadline, 'HH:mm')}`}
                </Typography>
              )}
            </>
          ) : (
            <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)}>
              {registrationDeadline !== undefined && isPast(registrationDeadline) && (
                <Alert severity='warning' variant='outlined'>
                  Du vil få bot om du registrerer eller endrer registreringsstatus etter fristen. Oppdatering av grunn gir deg ikke bot.
                </Alert>
              )}
              <FormControl>
                <Controller
                  control={control}
                  name='registration'
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup onChange={onChange} row value={value}>
                      <FormControlLabel control={<Radio />} label='Kommer' value={1} />
                      <FormControlLabel control={<Radio />} label='Kommer ikke' value={0} />
                    </RadioGroup>
                  )}
                />
              </FormControl>
              {watchRegistration === '0' && (
                <Controller
                  control={control}
                  name={'reason'}
                  render={({ field: { onChange, value } }) => <TextField autoFocus label={'Grunn'} onChange={onChange} required value={value} />}
                  rules={{ required: 'Du må oppgi en grunn' }}
                />
              )}
              <Button type='submit' variant='contained'>
                Bekreft
              </Button>
              <Button onClick={() => setOpenRegistration(false)} variant='text'>
                Avbryt
              </Button>
            </Stack>
          )}
        </>
      ) : (
        <Typography textAlign='center' variant='body2'>
          Du er ikke en del av {eventDetails.team?.name} og kan dermed ikke registrere oppmøte. Kom og se på! 🏟️
        </Typography>
      )}
    </>
  );
};

export default EventRegistration;
