'use client';

import PersonAddDisabledRoundedIcon from '@mui/icons-material/PersonAddDisabledRounded';
import { Card } from '@nextui-org/card';
import { Tooltip } from '@nextui-org/tooltip';
import { Player } from '@prisma/client';

import EditPlayerModal from 'components/team/EditPlayerModal';

export type PlayersListProps = {
  title: string;
  players: Player[];
};

const PlayersList = ({ title, players }: PlayersListProps) => {
  return (
    <Card className='flex flex-1 flex-col justify-between gap-2 rounded-md p-2'>
      <h3 className='font-cabin text-2xl font-bold'>
        {title} ({players.length})
      </h3>
      {players.map((player) => (
        <div className='flex gap-2' key={player.id}>
          <EditPlayerModal player={player} />
          <p className='text-md flex-1'>{player.name}</p>
          {player.disableRegistrations && (
            <Tooltip content='Deaktivert påmelding' showArrow>
              <PersonAddDisabledRoundedIcon />
            </Tooltip>
          )}
        </div>
      ))}
    </Card>
  );
};

export default PlayersList;
