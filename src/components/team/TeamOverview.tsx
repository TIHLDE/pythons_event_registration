import { Position, Team } from '@prisma/client';

import { PlayersList, type PlayersListProps } from '~/components/team/PlayersList';
import { TeamDelete } from '~/components/team/TeamDelete';

export type TeamOverviewProps = {
  team: Team | string;
  positions: {
    type: Position;
    label: string;
    players: PlayersListProps['players'];
  }[];
};

const TeamOverview = ({ team, positions }: TeamOverviewProps) => {
  return (
    <>
      <div className='mb-2 flex justify-between'>
        <h2 className='font-oswald text-2xl font-bold'>
          {typeof team === 'string' ? team : `${team.name} (${positions.reduce((acc, curr) => acc + curr.players.length, 0)})`}
        </h2>
        {typeof team !== 'string' && <TeamDelete team={team} />}
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
