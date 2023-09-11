'use client';

import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material';
import { MatchEventType } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { getSemesters, MATCH_EVENT_TYPES, removeFalsyElementsFromObject } from 'utils';

const semesters = getSemesters();

export type StatisticsFiltersProps = {
  teams: {
    id: number;
    name: string;
  }[];
};

type Filters = {
  semester: string;
  team: string;
  matchEventType: MatchEventType;
};

export const StatisticsFilters = ({ teams }: StatisticsFiltersProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    semester: typeof searchParams.get('semester') === 'string' ? searchParams.get('semester')! : '',
    team: typeof searchParams.get('team') === 'string' ? searchParams.get('team')! : '',
    matchEventType: typeof searchParams.get('matchEventType') === 'string' ? (searchParams.get('matchEventType') as MatchEventType) : MatchEventType.GOAL,
  });

  const handleChange = (event: SelectChangeEvent, field: keyof Filters) => {
    const newFilters = { ...filters, [field]: event.target.value as string };
    setFilters(newFilters);
    router.replace(`${pathname}?${new URLSearchParams(removeFalsyElementsFromObject(newFilters)).toString()}`, { scroll: false });
  };

  return (
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
  );
};
