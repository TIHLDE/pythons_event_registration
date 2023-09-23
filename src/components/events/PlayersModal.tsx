'use client';

import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, IconButton, Stack, Typography } from '@mui/material';
import { Event, Prisma } from '@prisma/client';
import Image from 'next/image';
import { useMemo } from 'react';
import { positionsList } from 'utils';

import { useModal } from 'hooks/useModal';

export type ExtendedRegistrations = Prisma.RegistrationsGetPayload<{
  include: {
    player: true;
  };
}>;

export type PlayersModalProps = {
  registrations: ExtendedRegistrations[];
  title: string;
  eventType: Event['eventType'];
};

const PlayersModal = ({ eventType, registrations, title }: PlayersModalProps) => {
  const { modalOpen, handleOpenModal, handleCloseModal } = useModal(false);

  const groupedPlayers = useMemo(
    () =>
      positionsList.map((position) => ({
        ...position,
        players: registrations.filter((registration) => registration.player.position === position.type),
      })),
    [registrations],
  );

  return (
    <>
      <Button color='menu' onClick={handleOpenModal} size='small' sx={{ flexDirection: 'column', flex: 1 }}>
        <Typography component='span' variant='h3'>
          {registrations.length}
        </Typography>
        <Typography component='span' variant='body2'>
          {title}
        </Typography>
      </Button>
      <Dialog onClose={handleCloseModal} open={modalOpen} sx={{ '& .MuiPaper-root': { background: ({ palette }) => palette.background[eventType] } }}>
        <Stack gap={1}>
          <Stack direction='row' spacing={2} sx={{ alignItems: 'center' }}>
            <Image alt='Logo' height={37.625} src='/pythons.png' width={25} />
            <Typography sx={{ flex: 1 }} variant='h2'>{`${title} (${registrations.length})`}</Typography>
            <IconButton onClick={handleCloseModal}>
              <Close />
            </IconButton>
          </Stack>
          {groupedPlayers.map((position) => (
            <Stack key={position.type} spacing={1}>
              <Typography sx={{ fontWeight: 'bold' }} variant='h3'>
                {position.label} ({position.players.length})
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 1 }}>
                {position.players.map((registration: ExtendedRegistrations) => (
                  <div key={registration.playerId}>
                    <Typography fontWeight='bold' variant='body2'>
                      {registration.player.name}
                    </Typography>
                    {registration.reason && <Typography variant='body2'>- {registration.reason}</Typography>}
                  </div>
                ))}
              </Box>
            </Stack>
          ))}
        </Stack>
      </Dialog>
    </>
  );
};

export default PlayersModal;
