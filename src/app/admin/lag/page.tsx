import { Divider, Stack, Typography } from '@mui/material';
import { prisma } from 'lib/prisma';

import { NewTeam } from 'components/team/NewTeam';
import TeamOverview from 'components/team/TeamOverview';

const getData = async () => {
  const teams_list = await prisma.team.findMany();

  const teams = await Promise.all(
    teams_list.map(async (team) => ({
      ...team,
      positions: await prisma.position.findMany({
        select: {
          id: true,
          title: true,
          Player: {
            where: {
              active: true,
              teamId: team.id,
            },
            select: {
              id: true,
              name: true,
              positionId: true,
              teamId: true,
            },
            orderBy: { name: 'asc' },
          },
        },
      }),
    })),
  );

  const players_with_no_team = await prisma.position.findMany({
    select: {
      id: true,
      title: true,
      Player: {
        where: {
          active: true,
          teamId: null,
        },
        select: {
          id: true,
          name: true,
          positionId: true,
          teamId: true,
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
  });

  return { players_with_no_team, teams };
};

const Teams = async () => {
  const { players_with_no_team, teams } = await getData();
  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Typography sx={{ my: 2, whiteSpace: 'break-spaces' }} variant='body1'>
        {`Spillerne her synkroniseres automatisk med personene som er med i TIHLDE Pythons sin gruppe på TIHLDE.org. Det betyr at for å legge til en ny spiller her, så må du leder legge til personen på TIHLDE.org først, synkroniseringen skjer automatisk hver hele time. Eventuelle nye spillere uten lagtilhørighet vises nederst på siden.

For å fjerne en (eller flere) spillere gjøres det samme: leder må gå inn på TIHLDE.org og fjerne personens medlemsskap til TIHLDE Pythons. Spilleren vil da forsvinne herfra ved neste synkronisering. Data om spilleren slettes ikke, tidligere spillere sin statistikk vil fremdeles være tilgjengelig på Statistikk-siden.`}
      </Typography>
      <Divider sx={{ my: 2 }} />
      {teams.map((team, index) => (
        <Stack gap={1} key={team.id}>
          <TeamOverview positions={team.positions} team={team} />
          {index !== teams.length - 1 && <Divider sx={{ mb: 2, mt: 1 }} />}
        </Stack>
      ))}
      <Divider sx={{ my: 2 }} />
      <NewTeam />
      {players_with_no_team.some((position) => position.Player.length) && (
        <>
          <Divider sx={{ my: 2 }} />
          <TeamOverview positions={players_with_no_team} team='Spillere uten lagtilknytning' />
        </>
      )}
    </>
  );
};

export default Teams;
