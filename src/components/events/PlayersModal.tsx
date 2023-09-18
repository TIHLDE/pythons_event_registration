'use client';

import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, IconButton, Stack, TypeBackground, Typography } from '@mui/material';
import { Event, Prisma } from '@prisma/client';
import Image from 'next/image';

import { useModal } from 'hooks/useModal';
import { usePositions } from 'hooks/useQuery';

import LoadingLogo from 'components/LoadingLogo';

export type ExtendedRegistrations = Prisma.RegistrationsGetPayload<{
  include: {
    player: true;
  };
}>;

export type PlayersModalProps = {
  registrations: ExtendedRegistrations[];
  title: string;
  eventType: Event['eventTypeSlug'];
};

const PlayersModal = ({ eventType, registrations, title }: PlayersModalProps) => {
  const { data: positions = [] } = usePositions();
  const { modalOpen, handleOpenModal, handleCloseModal } = useModal(false);

  const groupedPlayers = positions.map((position) => ({
    ...position,
    players: registrations.filter((registration) => registration.player.positionId === position.id),
  }));

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
      <Dialog
        onClose={handleCloseModal}
        open={modalOpen}
        sx={{ '& .MuiPaper-root': { background: ({ palette }) => palette.background[eventType as keyof TypeBackground] } }}>
        {!positions.length ? (
          <LoadingLogo />
        ) : (
          <Stack gap={1}>
            <Stack direction='row' spacing={2}>
              <Image alt='Logo' height={37.625} src='/pythons.png' width={25} />
              <Typography sx={{ flex: 1 }} variant='h2'>{`${title} (${registrations.length})`}</Typography>
              <IconButton onClick={handleCloseModal}>
                <Close />
              </IconButton>
            </Stack>
            {groupedPlayers.map((pos) => (
              <Stack key={pos.id} spacing={1}>
                <Typography sx={{ fontWeight: 'bold' }} variant='h3'>
                  {pos.title} ({pos.players.length})
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 1 }}>
                  {pos.players.map((registration: ExtendedRegistrations) => (
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
        )}
      </Dialog>
    </>
  );
};

export default PlayersModal;
