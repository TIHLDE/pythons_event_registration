import { Box, Modal, Stack, Typography } from '@mui/material';
import filter from 'lodash/filter';
import Image from 'next/image';
import useSWR from 'swr';
import { fetcher } from 'utils';

import { IPosition, IRegistrations } from 'types';

export type PlayersModalProps = {
  registrations: IRegistrations[];
  open: boolean;
  handleClose: () => void;
  title: string;
};

const PlayersModal = ({ registrations, open, handleClose, title }: PlayersModalProps) => {
  const { data: positions = [] } = useSWR<IPosition[]>('/api/positions', fetcher);

  const groupedPlayers = positions.map((position) => ({
    ...position,
    players: filter(registrations, ['player.positionId', position.id]),
  }));

  return (
    <Modal onClose={handleClose} open={open}>
      <Stack
        spacing={2}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          maxWidth: '90%',
          maxHeight: '90%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #fff',
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
          outline: 0,
        }}>
        <Stack direction='row' spacing={2}>
          <Image alt='Logo' height={37.625} src='/pythons.png' width={25} />
          <Typography variant='h2'>{title}</Typography>
        </Stack>
        {groupedPlayers.map((pos) => (
          <Stack key={pos.id} spacing={1}>
            <Typography sx={{ fontWeight: 'bold' }} variant='h3'>
              {pos.title} ({pos.players.length})
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {pos.players.map((registration: IRegistrations) => (
                <div key={registration.playerId}>
                  <Typography variant='body2'>{registration.player.name}</Typography>
                  {registration.reason && <Typography variant='body2'>- {registration.reason}</Typography>}
                </div>
              ))}
            </Box>
          </Stack>
        ))}
      </Stack>
    </Modal>
  );
};

export default PlayersModal;
