'use client';

import { Position, Team } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import ConfirmModal from 'components/ConfirmModal';
import PlayersList, { PlayersListProps } from 'components/team/PlayersList';

export type TeamOverviewProps = {
  team: Team | string;
  positions: {
    type: Position;
    label: string;
    players: PlayersListProps['players'];
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
      <div className='mb-2 flex justify-between'>
        <h2 className='font-oswald text-2xl font-bold'>
          {typeof team === 'string' ? team : `${team.name} (${positions.reduce((acc, curr) => acc + curr.players.length, 0)})`}
        </h2>
        {typeof team !== 'string' && (
          <ConfirmModal
            description='Er du helt sikker? Lagets spillere vil ikke berøres, men bli stående uten tilhørighet til et lag.'
            onConfirm={() => deleteTeam(team.id)}
            size='sm'
            title='Slett lag'
            variant='bordered'>
            Slett
          </ConfirmModal>
        )}
      </div>
      <div className='grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
        {positions.map((position) => (
          <PlayersList key={position.type} players={position.players} title={position.label} />
        ))}
      </div>
    </>
  );
};

export default TeamOverview;
