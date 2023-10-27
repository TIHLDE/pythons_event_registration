'use client';

import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Input } from '@nextui-org/input';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { EventType, Player, Registrations } from '@prisma/client';
import axios from 'axios';
import { format, formatDistanceToNow, isFuture, isPast, subHours } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useReward } from 'react-rewards';

import { ExtendedEvent } from '~/functions/event';

import { rules } from '~/rules';

export type EventRegistrationProps = {
  eventDetails: ExtendedEvent;
  registration?: Registrations;
  player: Player;
};

type FormDataProps = {
  reason?: string;
  registration?: string | undefined;
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
        playerId: player.id,
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

  const eventRule = rules[eventDetails.eventType];
  const registrationDeadline = eventRule ? subHours(new Date(eventDetails.time), eventRule.deadlines.signupBefore) : undefined;

  const notAllowedRegisterError = useMemo(() => {
    // Everyone can sign up for social events
    if (eventDetails.eventType === EventType.SOCIAL) {
      return undefined;
    }
    // You cannot sign up for events if registrations is deactivated for your player. But existing registrations can be edited
    if (player.disableRegistrations && !registration) {
      return `Påmeldinger er deaktivert for deg. Du vil ikke motta bøter for manglende påmeldinger 🍻`;
    }
    // You can only sign up for events for a specific team if you're part of it
    if (eventDetails.team?.id && eventDetails.team?.id !== player.teamId) {
      return `Du er ikke en del av ${eventDetails.team?.name}-laget og kan dermed ikke registrere oppmøte. Kom og se på! 🏟️`;
    }
    return undefined;
  }, [eventDetails.eventType, eventDetails.team, player.disableRegistrations, player.teamId, registration]);

  return (
    <>
      {isFuture(new Date(eventDetails.time)) && <Divider />}
      {registration && (
        <p className='text-md text-center font-bold'>{registration.willArrive ? '🤝 Du er påmeldt' : `😥 Du er avmeldt: ${registration.reason}`}</p>
      )}
      <span className='fixed bottom-0 left-1/2 -translate-x-1/2' id='confetti' />
      {notAllowedRegisterError ? (
        <p className='text-center text-sm'>{notAllowedRegisterError}</p>
      ) : (
        <>
          {openRegistration ? (
            <form className='flex flex-col gap-2' onSubmit={handleSubmit(onSubmit)}>
              {registrationDeadline !== undefined && isPast(registrationDeadline) && (
                <Card className='border-1 border-solid border-yellow-500 dark:bg-yellow-900' fullWidth shadow='sm'>
                  <CardBody className='p-2'>
                    <p className='text-sm'>
                      Du vil få bot om du registrerer eller endrer registreringsstatus etter fristen. Oppdatering av grunn gir deg ikke bot.
                    </p>
                  </CardBody>
                </Card>
              )}
              <Controller
                control={control}
                name='registration'
                render={({ field: { value, onChange } }) => (
                  <RadioGroup onChange={onChange} orientation='horizontal' value={value}>
                    <Radio value='1'>Kommer</Radio>
                    <Radio value='0'>Kommer ikke</Radio>
                  </RadioGroup>
                )}
              />
              {watchRegistration === '0' && (
                <Controller
                  control={control}
                  name={'reason'}
                  render={({ field: { onChange, value } }) => <Input autoFocus label='Grunn' onChange={onChange} required value={value} variant='faded' />}
                  rules={{ required: 'Du må oppgi en grunn' }}
                />
              )}
              <Button color='primary' type='submit' variant='solid'>
                Bekreft
              </Button>
              <Button onClick={() => setOpenRegistration(false)} variant='light'>
                Avbryt
              </Button>
            </form>
          ) : (
            isFuture(new Date(eventDetails.time)) && (
              <>
                <Button color='primary' onClick={() => setOpenRegistration(true)} variant={userHasRegistrated ? 'light' : 'solid'}>
                  {userHasRegistrated ? 'Endre' : 'Registrer'} oppmøte
                </Button>
                {registrationDeadline !== undefined && (
                  <p className='text-center text-sm'>
                    {`Påmeldingsfrist ${isPast(registrationDeadline) ? 'var ' : ''}${formatDistanceToNow(registrationDeadline, {
                      locale: nb,
                      addSuffix: true,
                    })} - kl. ${format(registrationDeadline, 'HH:mm')}`}
                  </p>
                )}
              </>
            )
          )}
        </>
      )}
    </>
  );
};

export default EventRegistration;
