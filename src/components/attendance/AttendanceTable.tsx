'use client';

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

export type AttendanceTableProps = {
  players: {
    name: string;
    count: number;
  }[];
  eventsAmount: number;
};

export const AttendanceTable = ({ players, eventsAmount }: AttendanceTableProps) => {
  return (
    <Table aria-label='Oversikt over oppmøte for spillere' removeWrapper>
      <TableHeader>
        <TableColumn className='font-cabin text-lg font-bold text-white'>#</TableColumn>
        <TableColumn className='w-full font-cabin text-lg text-white'>Navn</TableColumn>
        <TableColumn className='font-cabin text-lg font-bold text-white'>Antall</TableColumn>
      </TableHeader>
      <TableBody emptyContent='Fant ingen treff med denne filtreringen'>
        {players.map((player, index) => (
          <TableRow key={index}>
            <TableCell className='text-md font-cabin text-white'>{index + 1}.</TableCell>
            <TableCell className='text-md font-cabin text-white'>{player.name}</TableCell>
            <TableCell className='text-md whitespace-nowrap font-cabin text-white'>
              {player.count} ({Math.round((player.count / eventsAmount) * 100) || 0}%)
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
