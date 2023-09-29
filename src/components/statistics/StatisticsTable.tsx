'use client';

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { MatchEventType } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { MATCH_EVENT_TYPES, stripEmojis } from 'utils';

export type StatisticsTableProps = {
  players: {
    name: string;
    count: number;
  }[];
};

export const StatisticsTable = ({ players }: StatisticsTableProps) => {
  const searchParams = useSearchParams();
  const matchEventType = searchParams.get('matchEventType');

  return (
    <Table aria-label='Oversikt over statistikk for spillere' removeWrapper>
      <TableHeader>
        <TableColumn className='font-cabin text-lg font-bold text-white'>#</TableColumn>
        <TableColumn className='font-cabin w-full text-lg text-white'>Navn</TableColumn>
        <TableColumn className='font-cabin text-lg font-bold text-white'>
          {stripEmojis(typeof matchEventType === 'string' ? MATCH_EVENT_TYPES[matchEventType as MatchEventType] : '')}
        </TableColumn>
      </TableHeader>
      <TableBody emptyContent='Fant ingen treff med denne filtreringen'>
        {players.map((player, index) => (
          <TableRow key={index}>
            <TableCell className='font-cabin text-md text-white'>{index + 1}.</TableCell>
            <TableCell className='font-cabin text-md text-white'>{player.name}</TableCell>
            <TableCell className='font-cabin text-md text-white'>{player.count}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
