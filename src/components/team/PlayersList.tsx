'use client';

import { Stack, Typography } from '@mui/material';
import { Player } from '@prisma/client';

import EditPlayerModal from 'components/team/EditPlayerModal';

export type PlayersListProps = {
  title: string;
  players: Player[];
};

const PlayersList = ({ title, players }: PlayersListProps) => {
  return (
    <Stack gap={1} justifyContent='space-between' sx={{ flex: 1, borderRadius: 1, border: (theme) => `1px solid ${theme.palette.divider}`, p: 1 }}>
      <Stack gap={1}>
        <Typography variant='h3'>
          {title} ({players.length})
        </Typography>
        {players.map((player) => (
          <Stack direction='row' gap={1} key={player.id}>
            <EditPlayerModal player={player} />
            <Typography variant='body1'>{player.name}</Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default PlayersList;
