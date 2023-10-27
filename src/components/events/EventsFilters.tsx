'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Tab, Tabs } from '@nextui-org/tabs';
import { addMonths, startOfToday } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdOutlineFilterList } from 'react-icons/md';

import { useTeams } from '~/hooks/useQuery';

import { StandaloneExpand } from '~/components/Expand';

import { eventTypesList, getSemesters, removeFalsyElementsFromObject } from '~/utils';

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

export const EventsFilters = ({ className }: { className?: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'all' | 'matches'>(typeof searchParams.get('semester') === 'string' ? 'matches' : 'all');
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

  const handleChange = (value: string, field: keyof MatchesFilters) => {
    const newFilters: MatchesFilters = { ...matchesFilters, [field]: value };
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
    <div className={`flex flex-col gap-4 ${className}`}>
      <Tabs
        className='font-cabin'
        classNames={{ tabContent: 'group-data-[selected=true]:font-bold' }}
        color='primary'
        fullWidth
        onSelectionChange={(key) => changeView(key as 'all' | 'matches')}
        selectedKey={view}
        size='lg'
        variant='bordered'>
        <Tab key='all' title='Alle' />
        <Tab key='matches' title='Terminliste' />
      </Tabs>
      {view === 'all' ? (
        <StandaloneExpand expanded={open} icon={<MdOutlineFilterList className='h-6 w-6' />} onExpand={() => setOpen((prev) => !prev)} primary='Filtrering'>
          <form className='grid grid-cols-1 gap-2 pt-2 md:grid-cols-2' onSubmit={handleSubmit(onSubmit)}>
            <Controller control={control} name='from' render={({ field }) => <Input label='Fra' placeholder='Fra' type='date' variant='faded' {...field} />} />
            <Controller control={control} name='to' render={({ field }) => <Input label='Til' placeholder='Til' type='date' variant='faded' {...field} />} />
            <Controller
              control={control}
              name='eventType'
              render={({ field: { onChange, value } }) => (
                <Select
                  items={[{ type: '', label: 'Alle' }, ...eventTypesList]}
                  label='Type'
                  onChange={(e) => onChange(e.target.value)}
                  selectedKeys={new Set([value])}
                  variant='faded'>
                  {(eventType) => (
                    <SelectItem key={eventType.type} value={eventType.type}>
                      {eventType.label}
                    </SelectItem>
                  )}
                </Select>
              )}
            />
            <Controller
              control={control}
              name='team'
              render={({ field: { onChange, value } }) => (
                <Select
                  items={[{ id: '', name: 'Alle' }, ...teams]}
                  label='Lag'
                  onChange={(e) => onChange(e.target.value)}
                  selectedKeys={new Set([value])}
                  variant='faded'>
                  {(team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  )}
                </Select>
              )}
            />
            <Button className='md:col-span-2' color='primary' type='submit' variant='solid'>
              Oppdater filtre
            </Button>
            <Button className='md:col-span-2' onClick={clearFilters} variant='bordered'>
              Fjern filtre
            </Button>
          </form>
        </StandaloneExpand>
      ) : (
        <div className='flex gap-2'>
          <Select
            items={semesters}
            label='Semester'
            onChange={(e) => handleChange(e.target.value, 'semester')}
            selectedKeys={new Set([matchesFilters.semester])}
            variant='faded'>
            {(semester) => (
              <SelectItem key={semester.id} value={semester.id}>
                {semester.label}
              </SelectItem>
            )}
          </Select>
          <Select
            items={[{ id: '', name: 'Alle' }, ...teams]}
            label='Lag'
            onChange={(e) => handleChange(e.target.value, 'team')}
            selectedKeys={new Set(matchesFilters.team ? [matchesFilters.team] : [])}
            variant='faded'>
            {(team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            )}
          </Select>
        </div>
      )}
    </div>
  );
};
