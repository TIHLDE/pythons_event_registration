import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, BoxProps, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { EventType, Prisma, Team } from '@prisma/client';
import { addMonths, isFuture, parseISO, startOfToday } from 'date-fns';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { fetcher, removeFalsyElementsFromObject } from 'utils';

const DEFAULT_FROM_DATE = startOfToday();
const DEFAULT_TO_DATE = addMonths(DEFAULT_FROM_DATE, 2);

export const getEventsWhereFilter = ({ query }: { query: ParsedUrlQuery }): Prisma.EventFindManyArgs => {
  const dateFrom = typeof query.from === 'string' && query.from !== '' ? parseISO(query.from) : DEFAULT_FROM_DATE;
  const dateTo = typeof query.to === 'string' && query.to !== '' ? parseISO(query.to) : DEFAULT_TO_DATE;
  const eventTypeFilter = typeof query.eventType === 'string' && query.eventType !== '' ? query.eventType : undefined;
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

type FormData = {
  from: string;
  to: string;
  eventType: string;
  team: string;
};

export const EventsFilters = (props: BoxProps) => {
  const router = useRouter();
  const { data: teams = [] } = useSWR<Team[]>('/api/teams', fetcher);
  const { data: eventTypes = [] } = useSWR<EventType[]>('/api/eventType', fetcher);
  const [open, setOpen] = useState(false);

  const { handleSubmit, control, reset } = useForm<FormData>({
    defaultValues: {
      to: typeof router.query.to === 'string' && router.query.to !== '' ? router.query.to : DEFAULT_TO_DATE.toJSON().substring(0, 10),
      from: typeof router.query.from === 'string' && router.query.from !== '' ? router.query.from : DEFAULT_FROM_DATE.toJSON().substring(0, 10),
      eventType: typeof router.query.eventType === 'string' ? router.query.eventType : '',
      team: typeof router.query.team === 'string' ? router.query.team : '',
    },
  });

  const onSubmit = async (query: Partial<FormData>) => {
    router.replace({ query: removeFalsyElementsFromObject(query) });
    setOpen(false);
  };
  const clearFilters = () => {
    onSubmit({});
    reset();
  };

  return (
    <Box {...props}>
      <Accordion expanded={open} onChange={() => setOpen((prev) => !prev)} sx={{ backgroundColor: '#001731' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Filtrering</AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
