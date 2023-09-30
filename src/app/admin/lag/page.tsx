import { Divider } from '@nextui-org/divider';
import { prisma } from 'lib/prisma';
import { positionsList } from 'utils';

import { NewTeam } from 'components/team/NewTeam';
import TeamOverview from 'components/team/TeamOverview';

const getData = async () => {
  const teamsQuery = prisma.team.findMany({
    include: {
      players: {
        where: {
          active: true,
        },
        orderBy: { name: 'asc' },
      },
    },
  });

  const playersWithNoTeamQuery = prisma.player.findMany({
    where: {
      teamId: null,
      active: true,
    },
    orderBy: { name: 'asc' },
  });

  const [teams, playersWithNoTeam] = await Promise.all([teamsQuery, playersWithNoTeamQuery]);

  const teamsWithPosition = teams.map((team) => ({
    id: team.id,
    name: team.name,
    positions: positionsList.map((position) => ({
      type: position.type,
      label: position.label,
      players: team.players.filter((player) => player.position === position.type),
    })),
  }));

  const noTeamPlayersWithPosition = positionsList.map((position) => ({
    type: position.type,
    label: position.label,
    players: playersWithNoTeam.filter((player) => player.position === position.type),
  }));

  return { noTeamPlayersWithPosition, teamsWithPosition };
};

const Teams = async () => {
  const { noTeamPlayersWithPosition, teamsWithPosition } = await getData();
  return (
    <>
      <Divider className='my-4' />
      <p className='text-md my-4 whitespace-break-spaces'>
        {`Spillerne her synkroniseres automatisk med personene som er med i TIHLDE Pythons sin gruppe på TIHLDE.org. Det betyr at for å legge til en ny spiller her, så må du leder legge til personen på TIHLDE.org først, synkroniseringen skjer automatisk hver hele time. Eventuelle nye spillere uten lagtilhørighet vises nederst på siden.

For å fjerne en (eller flere) spillere gjøres det samme: leder må gå inn på TIHLDE.org og fjerne personens medlemsskap til TIHLDE Pythons. Spilleren vil da forsvinne herfra ved neste synkronisering. Data om spilleren slettes ikke, tidligere spillere sin statistikk vil fremdeles være tilgjengelig på Statistikk-siden.

Kun spillere som er lagt til i et lag kan melde seg på lagets kamper. Spillere som kun skal være med på treninger/sosialt kan stå oppført uten lagtilknytning. Påmeldinger kan deaktiveres for enkeltspillere som midlertidig ikke skal behøve å melde seg på/av arrangementer, for eksempel på grunn av utveksling eller langtidsskade.`}
      </p>
      <Divider className='my-4' />
      {teamsWithPosition.map((team, index) => (
        <div className='flex flex-col gap-2' key={team.id}>
          <TeamOverview positions={team.positions} team={team} />
          {index !== teamsWithPosition.length - 1 && <Divider className='mb-4 mt-2' />}
        </div>
      ))}
      <Divider className='my-4' />
      <NewTeam />
      {noTeamPlayersWithPosition.some((position) => position.players.length) && (
        <>
          <Divider className='my-4' />
          <TeamOverview positions={noTeamPlayersWithPosition} team='Spillere uten lagtilknytning' />
        </>
      )}
    </>
  );
};

export default Teams;
