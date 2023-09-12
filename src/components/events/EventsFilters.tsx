'use client';

import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, StackProps, TextField } from '@mui/material';
import { addMonths, startOfToday } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { getSemesters, removeFalsyElementsFromObject } from 'utils';

import { useEventType, useTeams } from 'hooks/useQuery';

import { StandaloneExpand } from 'components/Expand';

const DEFAULT_FROM_DATE = startOfToday();
const DEFAULT_TO_DATE = addMonths(DEFAULT_FROM_DATE, 4);

type MatchesFilters = {
  semester: string;
  team: string;
};

type AllEventsFilters = {
  from: string;
  to: string;
  eventType: string;
  team: string;
};

const semesters = getSemesters();

export const EventsFilters = (props: StackProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'all' | 'matches'>(typeof searchParams.get('semester') === 'string' ? 'matches' : 'all');
  const { data: eventTypes = [] } = useEventType();
  const { data: teams = [] } = useTeams();
  const [matchesFilters, setMatchesFilters] = useState<MatchesFilters>({
    semester: typeof searchParams.get('semester') === 'string' ? searchParams.get('semester')! : '',
    team: typeof searchParams.get('team') === 'string' ? searchParams.get('team')! : '',
  });

  const { handleSubmit, control, reset } = useForm<AllEventsFilters>({
    defaultValues: {
      to: typeof searchParams.get('to') === 'string' && searchParams.get('to') !== '' ? searchParams.get('to')! : DEFAULT_TO_DATE.toJSON().substring(0, 10),
      from:
        typeof searchParams.get('from') === 'string' && searchParams.get('from') !== ''
          ? searchParams.get('from')!
          : DEFAULT_FROM_DATE.toJSON().substring(0, 10),
      eventType: typeof searchParams.get('eventType') === 'string' ? searchParams.get('eventType')! : '',
      team: typeof searchParams.get('team') === 'string' ? searchParams.get('team')! : '',
    },
  });

  const onSubmit = async (query: Partial<AllEventsFilters>) => {
    router.replace(`${pathname}?${new URLSearchParams(removeFalsyElementsFromObject(query)).toString()}`, { scroll: false });
    setOpen(false);
  };
  const clearFilters = () => {
    onSubmit({});
    reset();
  };

  const handleChange = (event: SelectChangeEvent, field: keyof MatchesFilters) => {
    const newFilters: MatchesFilters = { ...matchesFilters, [field]: event.target.value as string };
    updateMatchesFilters(newFilters);
  };

  const updateMatchesFilters = (newFilters: MatchesFilters) => {
    setMatchesFilters(newFilters);
    router.replace(`${pathname}?${new URLSearchParams(removeFalsyElementsFromObject(newFilters)).toString()}`, { scroll: false });
  };

  const changeView = (newView: typeof view) => {
    if (newView === 'all') {
      clearFilters();
    }
    if (newView === 'matches') {
      const newFilters: MatchesFilters = { semester: semesters[semesters.length - 1].id, team: '' };
      updateMatchesFilters(newFilters);
    }
    setView(newView);
  };

  return (
    <Stack gap={2} {...props}>
      <Stack direction='row' gap={1}>
        <Button
          color='menu'
          fullWidth
          onClick={() => changeView('all')}
          size='large'
          sx={{ fontWeight: view === 'all' ? 'bold' : undefined }}
          variant={view === 'all' ? 'contained' : 'outlined'}>
          Alle
        </Button>
        <Button
          color='menu'
          fullWidth
          onClick={() => changeView('matches')}
          size='large'
          sx={{ fontWeight: view === 'matches' ? 'bold' : undefined }}
          variant={view === 'matches' ? 'contained' : 'outlined'}>
          Terminliste
        </Button>
      </Stack>
      {view === 'all' ? (
        <StandaloneExpand expanded={open} icon={<FilterListRoundedIcon />} onExpand={() => setOpen((prev) => !prev)} primary='Filtrering'>
          <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ pt: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1 }}>
            <Controller control={control} name='from' render={({ field }) => <TextField label='Fra' type='date' {...field} />} />
            <Controller control={control} name='to' render={({ field }) => <TextField label='Til' type='date' {...field} />} />
            <FormControl fullWidth>
              <InputLabel id='selectType-type'>Type</InputLabel>
              <Controller
                control={control}
                name='eventType'
                render={({ field }) => (
                  <Select id='type' label='Type' labelId='selectType-type' {...field}>
                    <MenuItem value=''>Alle</MenuItem>
                    {eventTypes.map((eventType) => (
                      <MenuItem key={eventType.slug} value={eventType.slug}>
                        {eventType.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id='select-team'>Lag</InputLabel>
              <Controller
                control={control}
                name='team'
                render={({ field }) => (
                  <Select id='team' label='Lag' labelId='select-team' {...field}>
                    <MenuItem value=''>Alle</MenuItem>
                    {teams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <Button sx={{ gridColumn: { xs: undefined, md: 'span 2' } }} type='submit' variant='contained'>
              Oppdater filtre
            </Button>
            <Button onClick={clearFilters} sx={{ gridColumn: { xs: undefined, md: 'span 2' } }} variant='outlined'>
              Fjern filtre
            </Button>
          </Box>
        </StandaloneExpand>
      ) : (
        <Stack direction='row' gap={1} sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel id='select-semester'>Semester</InputLabel>
            <Select
              id='semester'
              label='Semester'
              labelId='select-semester'
              onChange={(e) => handleChange(e as SelectChangeEvent<string>, 'semester')}
              value={matchesFilters.semester}>
              {semesters.map((semester) => (
                <MenuItem key={semester.id} value={semester.id}>
                  {semester.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='select-team'>Lag</InputLabel>
            <Select
              id='team'
              label='Lag'
              labelId='select-team'
              onChange={(e) => handleChange(e as SelectChangeEvent<string>, 'team')}
              value={matchesFilters.team}>
              <MenuItem value=''>Alle</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}
    </Stack>
  );
};
