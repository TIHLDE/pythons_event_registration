'use client';

import { Select, SelectItem } from '@nextui-org/select';
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

  const handleChange = (event: string, field: keyof Filters) => {
    const newFilters = { ...filters, [field]: event };
    setFilters(newFilters);
    router.replace(`${pathname}?${new URLSearchParams(removeFalsyElementsFromObject(newFilters)).toString()}`, { scroll: false });
  };

  return (
    <div className='mb-4 flex gap-2'>
      <Select
        fullWidth
        items={[{ id: '', label: 'Alle' }, ...semesters]}
        label='Semester'
        onChange={(e) => handleChange(e.target.value, 'semester')}
        selectedKeys={new Set(filters.semester ? [filters.semester] : [])}
        variant='faded'>
        {(semester) => (
          <SelectItem key={semester.id} value={semester.id}>
            {semester.label}
          </SelectItem>
        )}
      </Select>
      <Select
        fullWidth
        items={[{ id: '', name: 'Alle' }, ...teams]}
        label='Lag'
        onChange={(e) => handleChange(e.target.value, 'team')}
        selectedKeys={new Set(filters.team ? [filters.team] : [])}
        variant='faded'>
        {(team) => (
          <SelectItem key={team.id} value={team.id}>
            {team.name}
          </SelectItem>
        )}
      </Select>
      <Select
        fullWidth
        label='Type'
        onChange={(e) => handleChange(e.target.value, 'matchEventType')}
        selectedKeys={new Set(filters.matchEventType ? [filters.matchEventType] : [])}
        variant='faded'>
        <SelectItem key={MatchEventType.GOAL} value={MatchEventType.GOAL}>
          {MATCH_EVENT_TYPES[MatchEventType.GOAL]}
        </SelectItem>
        <SelectItem key={MatchEventType.ASSIST} value={MatchEventType.ASSIST}>
          {MATCH_EVENT_TYPES[MatchEventType.ASSIST]}
        </SelectItem>
        <SelectItem key={MatchEventType.RED_CARD} value={MatchEventType.RED_CARD}>
          {MATCH_EVENT_TYPES[MatchEventType.RED_CARD]}
        </SelectItem>
        <SelectItem key={MatchEventType.YELLOW_CARD} value={MatchEventType.YELLOW_CARD}>
          {MATCH_EVENT_TYPES[MatchEventType.YELLOW_CARD]}
        </SelectItem>
        <SelectItem key={MatchEventType.MOTM} value={MatchEventType.MOTM}>
          {MATCH_EVENT_TYPES[MatchEventType.MOTM]}
        </SelectItem>
      </Select>
    </div>
  );
};
