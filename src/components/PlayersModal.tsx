import { Box, Dialog, Stack, Typography } from '@mui/material';
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
    <Dialog onClose={handleClose} open={open} sx={{ '& .MuiDialog-paper': { width: 400, border: '2px solid #ffffff', p: 4 } }}>
      <Stack gap={2}>
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
    </Dialog>
  );
};

export default PlayersModal;
