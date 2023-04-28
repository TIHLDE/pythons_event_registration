import CancelIcon from '@mui/icons-material/Cancel';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  NoSsr,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  TypeBackground,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { format, formatDistanceToNow, isFuture, isPast, subHours } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { ExtendedEvent } from 'queries';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useReward } from 'react-rewards';
import { rules } from 'rules';
import { stats } from 'stats';
import { getEventTitle } from 'utils';

import { useUser } from 'hooks/useUser';

import MatchModal, { MatchModalProps } from 'components/MatchModal';
import PlayersModal from 'components/PlayersModal';

export type EventProps = {
  eventDetails: ExtendedEvent;
  relatedMatches: MatchModalProps['event'][];
};

type FormDataProps = {
  reason?: string;
  registration?: string | number | undefined;
};

const Event = ({ eventDetails, relatedMatches }: EventProps) => {
  const { reward: willArriveConfetti } = useReward('confetti', 'confetti', { elementCount: 100, elementSize: 15 });
  const { reward: willNotArriveConfetti } = useReward('confetti', 'emoji', { emoji: ['😭', '😢', '💔'], elementCount: 40 });

  const router = useRouter();

  const [showPreviousMatches, setShowPreviousMatches] = useState(false);

  const toggleShowPreviousMatches = useCallback(() => {
    setShowPreviousMatches((prev) => !prev);
    stats.event(`Show previous matches`);
  }, []);

  const { data: user } = useUser();
  const userRegistration = eventDetails.registrations.find((registration) => registration.playerId === user?.id);

  const userHasRegistrated = Boolean(userRegistration);
  const { handleSubmit, control, watch } = useForm<FormDataProps>({
    defaultValues: {
      registration: userRegistration ? (userRegistration.willArrive ? '1' : '0') : '1',
      reason: userRegistration?.reason || '',
    },
  });

  const watchRegistration: number | string | undefined = watch('registration');
  const [openRegistration, setOpenRegistration] = useState(false);
  const onSubmit = useCallback(
    async (formData: FormDataProps) => {
      const data = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        playerId: user!.id,
        eventId: eventDetails.id,
        ...(formData.reason && {
          reason: formData.reason,
        }),
      };
      const willArrive = formData.registration === '1';
      if (willArrive) {
        willArriveConfetti();
      } else {
        willNotArriveConfetti();
      }
      if (userHasRegistrated) {
        await axios.put(`/api/registration/${data.playerId}_${data.eventId}`, { data, willArrive });
      } else {
        await axios.post('/api/registration', { data, willArrive });
      }
      setOpenRegistration(false);
      router.replace(router.asPath, undefined, { scroll: false });
    },
    [eventDetails.id, router, user, userHasRegistrated, willArriveConfetti, willNotArriveConfetti],
  );

  const registrationDeadline =
    eventDetails.eventTypeSlug in rules ? subHours(new Date(eventDetails.time), rules[eventDetails.eventTypeSlug].deadlines.signupBefore) : undefined;

  return (
    <Stack
      gap={1}
      sx={{
        background: ({ palette }) => palette.background[eventDetails.eventTypeSlug as keyof TypeBackground],
        width: '100%',
        height: 'auto',
        p: 1,
        borderRadius: 1,
      }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 1, columnGap: 2 }}>
        <Typography component='span' variant='h3'>
          {getEventTitle(eventDetails).icon}
        </Typography>
        <Typography fontWeight='bold' variant='h3'>
          {getEventTitle(eventDetails).title}
        </Typography>

        <Tooltip title='Tidspunkt'>
          <WatchLaterIcon />
        </Tooltip>
        <Typography sx={{ textTransform: 'capitalize' }} variant='body1'>
          {format(new Date(eventDetails.time), "EEEE dd. MMMM' 'HH:mm", {
            locale: nb,
          })}
        </Typography>
        <Tooltip title='Sted'>
          <LocationOnIcon />
        </Tooltip>
        <Typography variant='body1'>{eventDetails.location}</Typography>
        {eventDetails.team && (
          <>
            <Tooltip title='Lag'>
              <GroupsRoundedIcon />
            </Tooltip>
            <Typography variant='body1'>{eventDetails.team.name}</Typography>
          </>
        )}

        <Tooltip title='Påmeldt'>
          <CheckRoundedIcon />
        </Tooltip>
        <PlayersModal eventType={eventDetails.eventTypeSlug} registrations={eventDetails?.willArrive || []} title='Påmeldt' />
        <Tooltip title='Avmeldt'>
          <CancelIcon />
        </Tooltip>
        <PlayersModal eventType={eventDetails.eventTypeSlug} registrations={eventDetails?.willNotArrive || []} title='Avmeldt' />
        <Tooltip title='Ikke svart'>
          <QuestionMarkIcon />
        </Tooltip>
        <PlayersModal eventType={eventDetails.eventTypeSlug} registrations={eventDetails?.hasNotResponded || []} title='Ikke svart' />
      </Box>

      {((eventDetails.match && isPast(new Date(eventDetails.time))) || relatedMatches.length > 0) && <Divider sx={{ my: 0.5 }} />}
      {eventDetails.match && isPast(new Date(eventDetails.time)) && <MatchModal event={eventDetails} sx={{ my: -0.5 }} />}
      {relatedMatches.length > 0 && (
        <Stack gap={0.5}>
          <Button color='menu' onClick={toggleShowPreviousMatches}>
            {showPreviousMatches ? 'Skjul' : 'Vis'} tidligere oppgjør
          </Button>
          <Collapse in={showPreviousMatches} mountOnEnter unmountOnExit>
            {relatedMatches.map((relatedMatch) => (
              <MatchModal event={relatedMatch} key={relatedMatch.id} />
            ))}
          </Collapse>
        </Stack>
      )}
      <Divider sx={{ mt: 0.5 }} />
      <NoSsr>
        {userRegistration && (
          <Typography fontWeight='bold' sx={{ mb: -0.5 }} textAlign='center' variant='body1'>
            {userRegistration.willArrive ? '🤝 Du er påmeldt' : `😥 Du er avmeldt: ${userRegistration.reason}`}
          </Typography>
        )}
        <Box component='span' id='confetti' sx={{ position: 'fixed', bottom: 0, left: '50%', translate: '-50% 0' }} />
        {!eventDetails.teamId || eventDetails.teamId === user?.teamId ? (
          <>
            {!openRegistration ? (
              <>
                {isFuture(new Date(eventDetails.time)) && (
                  <Button disabled={!user} onClick={() => setOpenRegistration(true)} variant={userHasRegistrated ? 'text' : 'contained'}>
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
      </NoSsr>
    </Stack>
  );
};

export default Event;
