import { Grid } from '@mui/material';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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
  const { data: positions } = useSWR('/api/positions', fetcher);

  const groupedPlayers = positions?.map((position: IPosition) => ({
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
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
        <Stack direction='row' spacing={2}>
          <Image alt='Logo' height={37.625} src='/pythons.png' width={25} />
          <Typography variant='h6'>{title}</Typography>
        </Stack>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {groupedPlayers?.map((pos: any) => (
          <Stack key={pos.id} spacing={1}>
            <Typography sx={{ fontWeight: 'bold' }} variant='body1'>
              {pos.title} ({pos.players.length})
            </Typography>
            <Grid container justifyContent='space-between' rowSpacing={2}>
              {pos.players.map((registration: IRegistrations) => (
                <Grid item key={registration.playerId} xs={6}>
                  <Typography variant='body2'>{registration.player.name}</Typography>
                  {registration.reason && <Typography variant='body2'>- {registration.reason}</Typography>}
                </Grid>
              ))}
            </Grid>
          </Stack>
        ))}
      </Stack>
    </Modal>
  );
};

export default PlayersModal;
