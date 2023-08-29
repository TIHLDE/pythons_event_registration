import { Box, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Typography, TypographyProps } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { MatchEventType, Player, Team } from '@prisma/client';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';
import { getSemesters, MATCH_EVENT_TYPES, removeFalsyElementsFromObject, stripEmojis } from 'utils';

import { MainLinkMenu } from 'components/LinkMenu';

const semesters = getSemesters();

type StatisticsProps = {
  teams: Team[];
  players: (Player & {
    _count: {
      matchEvents: number;
    };
  })[];
};

export const getServerSideProps: GetServerSideProps<StatisticsProps> = async ({ query }) => {
  const semesterFilter = typeof query.semester === 'string' && query.semester !== '' ? semesters.find((semester) => semester.id === query.semester) : undefined;
  const teamFilter = typeof query.team === 'string' && query.team !== '' ? Number(query.team) : undefined;
  const matchEventTypeFilter =
    typeof query.matchEventType === 'string' && query.matchEventType !== '' ? (query.matchEventType as MatchEventType) : MatchEventType.GOAL;

  if (!query.semester && !query.team && !query.matchEventType) {
    return {
      redirect: {
        destination: `/statistikk?semester=${semesters[semesters.length - 1].id}&matchEventType=${MatchEventType.GOAL}`,
        permanent: false,
      },
    };
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

  const teamsQuery = prisma.team.findMany();

  const [teams, players] = await Promise.all([teamsQuery, playersQuery]);
  const sortedPlayers = players.filter((player) => player._count.matchEvents > 0).sort((a, b) => b._count.matchEvents - a._count.matchEvents);

  return {
    props: {
      players: JSON.parse(safeJsonStringify(sortedPlayers)),
      teams: JSON.parse(safeJsonStringify(teams)),
    },
  };
};

const TableText = ({ children, sx }: Pick<TypographyProps, 'children' | 'sx'>) => (
  <Typography component='p' sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' }, ...sx }} variant='h3'>
    {children}
  </Typography>
);

type Filters = {
  semester: string;
  team: string;
  matchEventType: MatchEventType;
};

const Statistics = ({ teams, players }: StatisticsProps) => {
  const { replace, query } = useRouter();
  const [filters, setFilters] = useState<Filters>({
    semester: typeof query.semester === 'string' ? query.semester : '',
    team: typeof query.team === 'string' ? query.team : '',
    matchEventType: typeof query.matchEventType === 'string' ? (query.matchEventType as MatchEventType) : MatchEventType.GOAL,
  });

  const handleChange = (event: SelectChangeEvent, field: keyof Filters) => {
    const newFilters = { ...filters, [field]: event.target.value as string };
    setFilters(newFilters);
    replace({ query: removeFalsyElementsFromObject(newFilters) });
  };

  return (
    <>
      <Head>
        <title>Statistikk - Pythons</title>
      </Head>
      <MainLinkMenu sx={{ mb: 2 }} />
      <Stack direction='row' gap={1} sx={{ mb: 2 }}>
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
      </Stack>
      {players.length ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', columnGap: 2, rowGap: 0.5 }}>
          <TableText sx={{ pl: 0.5, fontWeight: 'bold' }}>#</TableText>
          <TableText sx={{ fontWeight: 'bold' }}>Navn</TableText>
          <TableText sx={{ pr: 0.5, fontWeight: 'bold' }}>{stripEmojis(MATCH_EVENT_TYPES[filters.matchEventType])}</TableText>
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
