'use client';

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { MatchEventType } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

import { MATCH_EVENT_TYPES, stripEmojis } from '~/utils';

export type StatisticsTableProps = {
  players: {
    name: string;
    count: number;
  }[];
};

export const StatisticsTable = ({ players }: StatisticsTableProps) => {
  const [statsPlayers, setStatsPlayers] = useState(players);
  const searchParams = useSearchParams();
  const matchEventType = searchParams.get('matchEventType');

  useEffect(() => {
    if (!document.startViewTransition) {
      setStatsPlayers(players);
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setStatsPlayers(players);
      });
    });
  }, [players]);

  return (
    <Table aria-label='Oversikt over statistikk for spillere' removeWrapper>
      <TableHeader>
        <TableColumn className='font-cabin text-lg font-bold text-white'>#</TableColumn>
        <TableColumn className='w-full font-cabin text-lg text-white'>Navn</TableColumn>
        <TableColumn className='font-cabin text-lg font-bold text-white'>
          {stripEmojis(typeof matchEventType === 'string' ? MATCH_EVENT_TYPES[matchEventType as MatchEventType] : '')}
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent='Fant ingen treff med denne filtreringen'>
        {statsPlayers.map((player, index) => (
          <TableRow key={index}>
            <TableCell className='text-md font-cabin text-white'>{index + 1}.</TableCell>
            <TableCell className='text-md font-cabin text-white' style={{ 'view-transition-name': `name-${player.name.replaceAll(' ', '')}` }}>
              {player.name}
            </TableCell>
            <TableCell className='text-md font-cabin text-white' style={{ 'view-transition-name': `count-${player.name.replaceAll(' ', '')}` }}>
              {player.count}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
