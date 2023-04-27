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
  styled,
  TextField,
  Tooltip,
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

import { useModal } from 'hooks/useModal';
import { useUser } from 'hooks/useUser';

import MatchModal, { MatchModalProps } from 'components/MatchModal';
import PlayersModal from 'components/PlayersModal';

const DialogText = styled(Typography)(() => ({
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export type EventProps = {
  eventDetails: ExtendedEvent;
  relatedMatches: MatchModalProps['event'][];
};

type FormDataProps = {
  reason?: string;
  registration?: string | number | undefined;
};

const Event = ({ eventDetails, relatedMatches }: EventProps) => {
  const {
    modalOpen: openRegistratedPlayersModal,
    handleOpenModal: handleOpenRegistratedPlayersModal,
    handleCloseModal: handleCloseRegistratedPlayersModal,
  } = useModal(false);

  const {
    modalOpen: openDeregistratedPlayersModal,
    handleOpenModal: handleOpenDeregistratedPlayersModal,
    handleCloseModal: handleCloseDeregistratedPlayersModal,
  } = useModal(false);
  const {
    modalOpen: openHasNotAnsweredModal,
    handleOpenModal: handleOpenHasNotAnsweredModal,
    handleCloseModal: handleCloseHasNotAnsweredModal,
  } = useModal(false);

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
  const onSubmit = async (formData: FormDataProps) => {
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
      axios
        .put(`/api/registration/${data.playerId}_${data.eventId}`, {
          data,
          willArrive,
        })
        .then(() => {
          setOpenRegistration(false);
          router.replace(router.asPath);
        });
    } else {
      axios
        .post('/api/registration', {
          data: data,
          willArrive,
        })
        .then(() => {
          setOpenRegistration(false);
          router.replace(router.asPath);
        });
    }
  };

  const registrationDeadline =
    eventDetails.eventTypeSlug in rules ? subHours(new Date(eventDetails.time), rules[eventDetails.eventTypeSlug].deadlines.signupBefore) : undefined;

  const backgroundColor =
    eventDetails.type.slug === 'trening'
      ? 'linear-gradient(to bottom, #3A2056, #0b0941)'
      : eventDetails.type.slug === 'kamp'
      ? 'linear-gradient(to bottom, #6e2a70, #4c126b)'
      : 'linear-gradient(to bottom, #565220, #563A20)';

  return (
    <Stack gap={1} sx={{ background: backgroundColor, width: '100%', height: 'auto', p: 1, borderRadius: 1 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 1, columnGap: 2 }}>
        <Typography component='span' variant='h3'>
          {getEventTitle(eventDetails).icon}
        </Typography>
        <Typography variant='h3'>{getEventTitle(eventDetails).title}</Typography>

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

        <Tooltip title='Påmeldte'>
          <CheckRoundedIcon />
        </Tooltip>
        <DialogText onClick={handleOpenRegistratedPlayersModal} role='button' tabIndex={0} variant='body1'>
          {eventDetails.willArrive?.length} påmeldt
        </DialogText>
        <Tooltip title='Avmeldte'>
          <CancelIcon />
        </Tooltip>
        <DialogText onClick={handleOpenDeregistratedPlayersModal} role='button' tabIndex={0} variant='body1'>
          {eventDetails.willNotArrive?.length} avmeldt
        </DialogText>
        <Tooltip title='Ikke svart'>
          <QuestionMarkIcon />
        </Tooltip>
        <DialogText onClick={handleOpenHasNotAnsweredModal} role='button' tabIndex={0} variant='body1'>
          {eventDetails.hasNotResponded?.length} har ikke svart
        </DialogText>
      </Box>

      {openDeregistratedPlayersModal && (
        <PlayersModal
          handleClose={handleCloseDeregistratedPlayersModal}
          open={openDeregistratedPlayersModal}
          registrations={eventDetails?.willNotArrive || []}
          title='Avmeldt'
        />
      )}
      {openRegistratedPlayersModal && (
        <PlayersModal
          handleClose={handleCloseRegistratedPlayersModal}
          open={openRegistratedPlayersModal}
          registrations={eventDetails?.willArrive || []}
          title='Påmeldt'
        />
      )}
      {openHasNotAnsweredModal && (
        <PlayersModal
          handleClose={handleCloseHasNotAnsweredModal}
          open={openHasNotAnsweredModal}
          registrations={eventDetails?.hasNotResponded || []}
          title='Ikke svart'
        />
      )}
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
