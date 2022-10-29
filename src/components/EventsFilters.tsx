import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  StackProps,
  TextField,
} from '@mui/material';
import { EventType, Prisma, Team } from '@prisma/client';
import { addMonths, isFuture, parseISO, startOfToday } from 'date-fns';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { fetcher, getSemesters, removeFalsyElementsFromObject } from 'utils';

const DEFAULT_FROM_DATE = startOfToday();
const DEFAULT_TO_DATE = addMonths(DEFAULT_FROM_DATE, 2);

export const getEventsWhereFilter = ({ query }: { query: ParsedUrlQuery }): Prisma.EventFindManyArgs => {
  const semester = typeof query.semester === 'string' && query.semester !== '' ? semesters.find((semester) => semester.id === query.semester) : undefined;
  const dateFrom = semester ? semester.from : typeof query.from === 'string' && query.from !== '' ? parseISO(query.from) : DEFAULT_FROM_DATE;
  const dateTo = semester ? semester.to : typeof query.to === 'string' && query.to !== '' ? parseISO(query.to) : DEFAULT_TO_DATE;
  const eventTypeFilter = semester ? 'kamp' : typeof query.eventType === 'string' && query.eventType !== '' ? query.eventType : undefined;
  const teamFilter = typeof query.team === 'string' && query.team !== '' ? query.team : undefined;

  return {
    where: {
      AND: {
        time: {
          gte: dateFrom,
          lte: dateTo,
        },
        eventTypeSlug: eventTypeFilter ? { in: eventTypeFilter.split(',') } : undefined,
      },
      ...(teamFilter ? { OR: [{ teamId: null }, { teamId: Number(teamFilter) }] } : {}),
    },
    orderBy: {
      time: isFuture(dateTo) ? 'asc' : 'desc',
    },
  };
};

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
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'all' | 'matches'>(typeof router.query.semester === 'string' ? 'matches' : 'all');
  const { data: teams = [] } = useSWR<Team[]>(view === 'matches' ? '/api/teams' : null, fetcher);
  const { data: eventTypes = [] } = useSWR<EventType[]>(view === 'matches' ? '/api/eventType' : null, fetcher);
  const [matchesFilters, setMatchesFilters] = useState<MatchesFilters>({
    semester: typeof router.query.semester === 'string' ? router.query.semester : '',
    team: typeof router.query.team === 'string' ? router.query.team : '',
  });

  const { handleSubmit, control, reset } = useForm<AllEventsFilters>({
    defaultValues: {
      to: typeof router.query.to === 'string' && router.query.to !== '' ? router.query.to : DEFAULT_TO_DATE.toJSON().substring(0, 10),
      from: typeof router.query.from === 'string' && router.query.from !== '' ? router.query.from : DEFAULT_FROM_DATE.toJSON().substring(0, 10),
      eventType: typeof router.query.eventType === 'string' ? router.query.eventType : '',
      team: typeof router.query.team === 'string' ? router.query.team : '',
    },
  });

  const onSubmit = async (query: Partial<AllEventsFilters>) => {
    router.replace({ query: removeFalsyElementsFromObject(query) });
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
    router.replace({ query: removeFalsyElementsFromObject(newFilters) });
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
        <Box>
          <Accordion expanded={open} onChange={() => setOpen((prev) => !prev)} sx={{ backgroundColor: '#001731' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Filtrering</AccordionSummary>
            <AccordionDetails>
              <Box
                component='form'
                onSubmit={handleSubmit(onSubmit)}
                sx={{ pt: 1, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1 }}>
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
            </AccordionDetails>
          </Accordion>
        </Box>
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
