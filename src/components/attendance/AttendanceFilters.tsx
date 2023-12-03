'use client';

import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { EventType } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MdOutlineFilterList } from 'react-icons/md';

import { StandaloneExpand } from '~/components/Expand';

import { eventTypesList, removeFalsyElementsFromObject } from '~/utils';
import { MIN_DATE } from '~/values';

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
      <StandaloneExpand expanded={open} icon={<MdOutlineFilterList className='h-6 w-6' />} onExpand={() => setOpen((prev) => !prev)} primary='Filtrering'>
        <form className='grid grid-cols-1 gap-2 pt-2 md:grid-cols-2' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name='from'
            render={({ field }) => <Input label='Fra' min={MIN_DATE} placeholder='Fra' type='date' variant='faded' {...field} />}
          />
          <Controller
            control={control}
            name='to'
            render={({ field }) => <Input label='Til' min={MIN_DATE} placeholder='Til' type='date' variant='faded' {...field} />}
          />
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
          <Controller
            control={control}
            name='willArrive'
            render={({ field: { onChange, value } }) => (
              <Select label='Oppmøte' onChange={(e) => onChange(e.target.value)} selectedKeys={new Set([value])} variant='faded'>
                <SelectItem key='' value=''>
                  Alle
                </SelectItem>
                <SelectItem key='yes' value='yes'>
                  Ja
                </SelectItem>
                <SelectItem key='no' value='no'>
                  Nei
                </SelectItem>
                <SelectItem key='none' value='none'>
                  Ikke registrert
                </SelectItem>
              </Select>
            )}
          />
          <Button className='md:col-span-2' color='primary' type='submit' variant='solid'>
            Oppdater filtre
          </Button>
        </form>
      </StandaloneExpand>
      {(searchParams.get('eventType') === EventType.MATCH || !searchParams.get('eventType')) && !searchParams.get('team') && (
        <Card className='mt-4 border-1 border-solid border-blue-500 dark:bg-blue-900' fullWidth shadow='sm'>
          <CardBody className='p-2'>
            <p className='text-sm'>
              Kamper er en del av filtreringen uten at et lag er valgt. Det medfører at ingen kan ha 100% påmeldinger ettersom det ikke er mulig å melde seg på
              andre lags kamper.
            </p>
          </CardBody>
        </Card>
      )}
    </>
  );
};
