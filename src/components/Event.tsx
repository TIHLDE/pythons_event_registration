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
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { format, formatDistanceToNow, isFuture, isPast, subHours } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useReward } from 'react-rewards';
import rules from 'rules';

import { useModal } from 'hooks/useModal';
import { useUser } from 'hooks/useUser';

import MatchModal from 'components/MatchModal';
import PlayersModal from 'components/PlayersModal';

const DialogText = styled(Typography)(() => ({
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export type ExtendedEvent = Prisma.EventGetPayload<{
  include: {
    registrations: true;
    type: true;
    team: true;
    match: true;
  };
}> & {
  willArrive: Prisma.RegistrationsGetPayload<{
    include: {
      player: {
        include: {
          position: true;
        };
      };
    };
  }>[];
  willNotArrive: Prisma.RegistrationsGetPayload<{
    include: {
      player: {
        include: {
          position: true;
        };
      };
    };
  }>[];
  hasNotResponded: Prisma.RegistrationsGetPayload<{
    include: {
      player: {
        include: {
          position: true;
        };
      };
    };
  }>[];
};
type EventProps = {
  eventDetails: ExtendedEvent;
};

type FormDataProps = {
  reason?: string;
  registration?: string | number | undefined;
};

const Event = ({ eventDetails }: EventProps) => {
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

  const registrationDeadline = subHours(
    new Date(eventDetails.time),
    eventDetails.type.slug === 'trening' ? rules.deadlineBeforeTraining : rules.deadlineBeforeMatch,
  );

  const backgroundColor = eventDetails.type.slug === 'trening' ? '#3A2056' : eventDetails.type.slug === 'kamp' ? '#552056' : '#563A20';

  return (
    <Stack
      gap={1}
      sx={{
        backgroundColor: backgroundColor,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        width: '100%',
        height: 'auto',
        p: 1,
        borderRadius: 1,
      }}>
      {eventDetails.type.slug === 'trening' && <Typography variant='h3'>💪 Trening</Typography>}
      {eventDetails.type.slug === 'kamp' && eventDetails.title && <Typography variant='h3'>⚽️ Kamp mot {eventDetails.title}</Typography>}
      {eventDetails.type.slug === 'sosialt' && eventDetails.title && <Typography variant='h3'>🎉 {eventDetails.title}</Typography>}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 1, columnGap: 2 }}>
        <NoSsr>
          {userRegistration?.willArrive && (
            <>
              🤝
              <Typography sx={{ fontStyle: 'italic' }} variant='body1'>
                Du er påmeldt
              </Typography>
            </>
          )}
          {!userRegistration?.willArrive && userRegistration?.reason && (
            <>
              😓
              <Typography sx={{ fontStyle: 'italic' }} variant='body1'>
                Du er avmeldt: {userRegistration.reason}
              </Typography>
            </>
          )}
        </NoSsr>
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
      {eventDetails.match && isPast(new Date(eventDetails.time)) && (
        <>
          <Divider sx={{ my: 1 }} />
          <MatchModal event={eventDetails} sx={{ gridColumn: 'span 2' }} />
        </>
      )}
      <Divider sx={{ mt: 1 }} />
      <NoSsr>
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
                {(eventDetails.type.slug === 'trening' || eventDetails.type.slug === 'kamp') && (
                  <Typography textAlign='center' variant='body2'>
                    {`Påmeldingsfrist ${isPast(registrationDeadline) ? 'var ' : ''}${formatDistanceToNow(registrationDeadline, {
                      locale: nb,
                      addSuffix: true,
                    })} - kl. ${format(registrationDeadline, 'HH:mm')}`}
                  </Typography>
                )}
              </>
            ) : (
              <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)}>
                {isPast(registrationDeadline) && (
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
