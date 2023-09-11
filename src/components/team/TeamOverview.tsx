'use client';

import { Box, Stack, Typography } from '@mui/material';
import { Team } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import ConfirmModal from 'components/ConfirmModal';
import PlayersList, { PlayersListProps } from 'components/team/PlayersList';

export type TeamOverviewProps = {
  team: Team | string;
  positions: {
    id: number;
    title: string;
    Player: PlayersListProps['players'];
  }[];
};

const TeamOverview = ({ team, positions }: TeamOverviewProps) => {
  const router = useRouter();
  const deleteTeam = async (id: Team['id']) => {
    await axios.delete(`/api/teams/${id}`);
    router.refresh();
  };
  return (
    <>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 1 }}>
        <Typography variant='h2'>
          {typeof team === 'string' ? team : `${team.name} (${positions.reduce((acc, curr) => acc + curr.Player.length, 0)})`}
        </Typography>
        {typeof team !== 'string' && (
          <ConfirmModal
            color='error'
            description='Er du helt sikker? Lagets spillere vil ikke berøres, men bli stående uten tilhørighet til et lag.'
            onConfirm={() => deleteTeam(team.id)}
            size='small'
            title='Slett lag'
            variant='outlined'>
            Slett
          </ConfirmModal>
        )}
      </Stack>
      <Box gap={1} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' } }}>
        {positions.map((position) => (
          <PlayersList key={position.id} players={position.Player} title={position.title} />
        ))}
      </Box>
    </>
  );
};

export default TeamOverview;
