import CancelIcon from '@mui/icons-material/Cancel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { Box, Button, Divider, FormControl, FormControlLabel, Radio, RadioGroup, Stack, styled, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { format, formatDistanceToNow, subHours } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import rules from 'rules';
import useSWR from 'swr';

import { IEvent, IRegistrations } from 'types';

import { useModal } from 'hooks/useModal';

import PlayersModal from 'components/PlayersModal';

const Link = styled('a')(() => ({
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

type EventProps = {
  eventDetails: IEvent;
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

  const router = useRouter();

  const { data: user } = useSWR('user', (key) => {
    const value = localStorage.getItem(key);
    return !!value ? JSON.parse(value) : undefined;
  });

  const userRegistration = eventDetails.registrations.find((registration: IRegistrations) => registration.playerId === user?.id);

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
      playerId: user.id,
      eventId: eventDetails.id,
      ...(formData.reason && {
        reason: formData.reason,
      }),
      updatedAt: new Date(),
    };
    if (userHasRegistrated) {
      axios
        .put(`/api/registration/${data.playerId}_${data.eventId}`, {
          data,
          willArrive: formData.registration === '1',
        })
        .then(() => {
          setOpenRegistration(false);
          router.replace(router.asPath);
        });
    } else {
      axios
        .post('/api/registration', {
          data: data,
          willArrive: formData.registration === '1',
        })
        .then(() => {
          setOpenRegistration(false);
          router.replace(router.asPath);
        });
    }
  };

  const backgroundColor = eventDetails.type.slug === 'trening' ? '#3A2056' : eventDetails.type.slug === 'kamp' ? '#552056' : '#563A20';

  return (
    <Stack
      gap={1}
      sx={{
        backgroundColor: backgroundColor,
        border: '1px solid white',
        width: '100%',
        height: 'auto',
        p: 1,
        borderRadius: 1,
      }}>
      {eventDetails.type.slug === 'trening' && <Typography variant='h3'>💪 Trening</Typography>}
      {eventDetails.type.slug === 'kamp' && eventDetails.title && <Typography variant='h3'>⚽️ {eventDetails.title}</Typography>}
      {eventDetails.type.slug === 'sosialt' && eventDetails.title && <Typography variant='h3'>🎉 {eventDetails.title}</Typography>}
      {userRegistration?.willArrive && (
        <Typography sx={{ fontStyle: 'italic' }} variant='body1'>
          🤝 Du er påmeldt
        </Typography>
      )}
      {!userRegistration?.willArrive && userRegistration?.reason && (
        <Typography sx={{ fontStyle: 'italic' }} variant='body1'>
          😓 Du er avmeldt: {userRegistration.reason}
        </Typography>
      )}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 1, columnGap: 2 }}>
        <WatchLaterIcon />
        <Typography sx={{ textTransform: 'capitalize' }} variant='body1'>
          {format(new Date(eventDetails.time), "EEEE dd. MMMM' 'HH:mm", {
            locale: nb,
          })}
        </Typography>
        <LocationOnIcon />
        <Typography variant='body1'>{eventDetails.location}</Typography>
        <PeopleIcon />
        <Link>
          <Typography onClick={handleOpenRegistratedPlayersModal} variant='body1'>
            {eventDetails.willArrive?.length} påmeldt
          </Typography>
        </Link>
        <CancelIcon />
        <Link>
          <Typography onClick={handleOpenDeregistratedPlayersModal} variant='body1'>
            {eventDetails.willNotArrive?.length} avmeldt
          </Typography>
        </Link>
        <QuestionMarkIcon />
        <Link>
          <Typography onClick={handleOpenHasNotAnsweredModal} variant='body1'>
            {eventDetails.hasNotResponded?.length} har ikke svart
          </Typography>
        </Link>
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
          title='Påmeldt'
        />
      )}
      <Divider sx={{ mt: 1 }} />
      {!openRegistration ? (
        <>
          <Button disabled={!user} onClick={() => setOpenRegistration(true)} variant={userHasRegistrated ? 'text' : 'outlined'}>
            {userHasRegistrated ? 'Endre' : 'Registrer'} oppmøte
          </Button>
          {!userHasRegistrated && (eventDetails.type.slug === 'trening' || eventDetails.type.slug === 'kamp') && (
            <Typography textAlign='center' variant='body2'>
              Frist:{' '}
              {formatDistanceToNow(
                subHours(new Date(eventDetails.time), eventDetails.type.slug === 'trening' ? rules.deadlineBeforeTraining : rules.deadlineBeforeMatch),
                {
                  locale: nb,
                  addSuffix: true,
                },
              )}
            </Typography>
          )}
        </>
      ) : (
        <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)}>
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
    </Stack>
  );
};

export default Event;
