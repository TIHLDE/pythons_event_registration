import { Box, Divider, Typography, TypographyProps } from '@mui/material';
import { MatchEventType } from '@prisma/client';
import { getTeams } from 'functions/getTeams';
import { prisma } from 'lib/prisma';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Fragment } from 'react';
import { getSemesters, MATCH_EVENT_TYPES, stripEmojis } from 'utils';

import { PageProps } from 'types';

import { StatisticsFilters } from 'components/statistics/StatisticsFilters';

export const metadata: Metadata = {
  title: 'Statistikk - TIHLDE Pythons',
};

const semesters = getSemesters();

const getData = async ({ searchParams }: Pick<PageProps, 'searchParams'>) => {
  const semesterFilter =
    typeof searchParams.semester === 'string' && searchParams.semester !== '' ? semesters.find((semester) => semester.id === searchParams.semester) : undefined;
  const teamFilter = typeof searchParams.team === 'string' && searchParams.team !== '' ? Number(searchParams.team) : undefined;
  const matchEventTypeFilter =
    typeof searchParams.matchEventType === 'string' && searchParams.matchEventType !== ''
      ? (searchParams.matchEventType as MatchEventType)
      : MatchEventType.GOAL;

  if (!searchParams.semester && !searchParams.team && !searchParams.matchEventType) {
    return redirect(`/statistikk?semester=${semesters[semesters.length - 1].id}&matchEventType=${MatchEventType.GOAL}`);
  }

  const playersQuery = prisma.player.findMany({
    include: {
      _count: {
        select: {
          matchEvents: {
            where: {
              type: matchEventTypeFilter,
              match: {
                is: {
                  teamId: teamFilter,
                  event: {
                    is: {
                      time: semesterFilter
                        ? {
                            gte: semesterFilter.from,
                            lte: semesterFilter.to,
                          }
                        : undefined,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const [teams, players] = await Promise.all([getTeams(), playersQuery]);
  const sortedPlayers = players.filter((player) => player._count.matchEvents > 0).sort((a, b) => b._count.matchEvents - a._count.matchEvents);

  return {
    players: sortedPlayers,
    teams: teams,
  };
};

const TableText = ({ children, sx }: Pick<TypographyProps, 'children' | 'sx'>) => (
  <Typography component='p' sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' }, ...sx }} variant='h3'>
    {children}
  </Typography>
);

const Statistics = async ({ searchParams }: PageProps) => {
  const { teams, players } = await getData({ searchParams });
  // const searchParams = useSearchParams();
  // const router = useRouter();
  // const [filters, setFilters] = useState<Filters>({
  //   semester: typeof searchParams?.get('semester') === 'string' ? searchParams.get('semester') : '',
  //   team: typeof searchParams.get('team') === 'string' ? searchParams.get('team') : '',
  //   matchEventType: typeof searchParams.get('matchEventType') === 'string' ? (searchParams.get('matchEventType') as MatchEventType) : MatchEventType.GOAL,
  // });

  // const handleChange = (event: SelectChangeEvent, field: keyof Filters) => {
  //   const newFilters = { ...filters, [field]: event.target.value as string };
  //   setFilters(newFilters);
  //   replace({ query: removeFalsyElementsFromObject(newFilters) });
  // };

  return (
    <>
      <StatisticsFilters teams={teams} />
      {/* <Stack direction='row' gap={1} sx={{ mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel id='select-semester'>Semester</InputLabel>
          <Select
            id='semester'
            label='Semester'
            labelId='select-semester'
            onChange={(e) => handleChange(e as SelectChangeEvent<string>, 'semester')}
            value={filters.semester}>
            <MenuItem value=''>Alle</MenuItem>
            {semesters.map((semester) => (
              <MenuItem key={semester.id} value={semester.id}>
                {semester.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id='select-team'>Lag</InputLabel>
          <Select id='team' label='Lag' labelId='select-team' onChange={(e) => handleChange(e as SelectChangeEvent<string>, 'team')} value={filters.team}>
            <MenuItem value=''>Alle</MenuItem>
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id='type-label'>Type</InputLabel>
          <Select
            id='type'
            label='Type'
            labelId='type-label'
            onChange={(e) => handleChange(e as SelectChangeEvent<string>, 'matchEventType')}
            required
            value={filters.matchEventType}>
            <MenuItem value={MatchEventType.GOAL}>{MATCH_EVENT_TYPES[MatchEventType.GOAL]}</MenuItem>
            <MenuItem value={MatchEventType.ASSIST}>{MATCH_EVENT_TYPES[MatchEventType.ASSIST]}</MenuItem>
            <MenuItem value={MatchEventType.RED_CARD}>{MATCH_EVENT_TYPES[MatchEventType.RED_CARD]}</MenuItem>
            <MenuItem value={MatchEventType.YELLOW_CARD}>{MATCH_EVENT_TYPES[MatchEventType.YELLOW_CARD]}</MenuItem>
            <MenuItem value={MatchEventType.MOTM}>{MATCH_EVENT_TYPES[MatchEventType.MOTM]}</MenuItem>
          </Select>
        </FormControl>
      </Stack> */}
      {players.length ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', columnGap: 2, rowGap: 0.5 }}>
          <TableText sx={{ pl: 0.5, fontWeight: 'bold' }}>#</TableText>
          <TableText sx={{ fontWeight: 'bold' }}>Navn</TableText>
          <TableText sx={{ pr: 0.5, fontWeight: 'bold' }}>
            {stripEmojis(typeof searchParams.matchEventType === 'string' ? MATCH_EVENT_TYPES[searchParams.matchEventType as MatchEventType] : '')}
          </TableText>
          <Divider sx={{ gridColumn: 'span 3' }} />
          {players.map((player, index) => (
            <Fragment key={player.id}>
              <TableText sx={{ pl: 0.5 }}>{index + 1}.</TableText>
              <TableText>{player.name}</TableText>
              <TableText sx={{ pr: 0.5 }}>{player._count.matchEvents}</TableText>
              <Divider sx={{ gridColumn: 'span 3' }} />
            </Fragment>
          ))}
        </Box>
      ) : (
        <Typography>Fant ingen treff med denne filtreringen</Typography>
      )}
    </>
  );
};

export default Statistics;
