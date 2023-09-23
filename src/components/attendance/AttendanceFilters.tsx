'use client';

import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { EventType } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { eventTypesList, removeFalsyElementsFromObject } from 'utils';

import { StandaloneExpand } from 'components/Expand';

export type AttendanceFiltersProps = {
  teams: {
    id: number;
    name: string;
  }[];
  defaultToDate: Date;
  defaultFromDate: Date;
};

type FormData = {
  from: string;
  to: string;
  eventType: string;
  team: string;
  willArrive: string;
};

export const AttendanceFilters = ({ defaultToDate, defaultFromDate, teams }: AttendanceFiltersProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const { handleSubmit, control } = useForm<FormData>({
    defaultValues: {
      to: typeof searchParams.get('to') === 'string' && searchParams.get('to') !== '' ? searchParams.get('to')! : defaultToDate.toJSON().substring(0, 10),
      from:
        typeof searchParams.get('from') === 'string' && searchParams.get('from') !== '' ? searchParams.get('from')! : defaultFromDate.toJSON().substring(0, 10),
      eventType: typeof searchParams.get('eventType') === 'string' ? searchParams.get('eventType')! : '',
      team: typeof searchParams.get('team') === 'string' ? searchParams.get('team')! : '',
      willArrive: typeof searchParams.get('willArrive') === 'string' ? searchParams.get('willArrive')! : '',
    },
  });

  const onSubmit = async (query: FormData) => {
    router.replace(`${pathname}?${new URLSearchParams(removeFalsyElementsFromObject(query)).toString()}`, { scroll: false });
    setOpen(false);
  };

  return (
    <>
      <StandaloneExpand expanded={open} icon={<FilterListRoundedIcon />} onExpand={() => setOpen((prev) => !prev)} primary='Filtrering' sx={{ mb: 2 }}>
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
                  {eventTypesList.map((eventType) => (
                    <MenuItem key={eventType.type} value={eventType.type}>
                      {eventType.label}
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
          <FormControl fullWidth>
            <InputLabel id='select-willArrive'>Oppmøte</InputLabel>
            <Controller
              control={control}
              name='willArrive'
              render={({ field }) => (
                <Select id='willArrive' label='Oppmøte' labelId='select-willArrive' {...field}>
                  <MenuItem value=''>Alle</MenuItem>
                  <MenuItem value='yes'>Ja</MenuItem>
                  <MenuItem value='no'>Nei</MenuItem>
                  <MenuItem value='none'>Ikke registrert</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          <Button sx={{ gridColumn: { xs: undefined, md: 'span 2' } }} type='submit' variant='contained'>
            Oppdater filtre
          </Button>
        </Box>
      </StandaloneExpand>
      {(searchParams.get('eventType') === EventType.MATCH || !searchParams.get('eventType')) && !searchParams.get('team') && (
        <Alert severity='info' sx={{ mb: 1 }} variant='outlined'>
          Kamper er en del av filtreringen uten at et lag er valgt. Det medfører at ingen kan ha 100% påmeldinger ettersom det ikke er mulig å melde seg på
          andre lags kamper.
        </Alert>
      )}
    </>
  );
};
