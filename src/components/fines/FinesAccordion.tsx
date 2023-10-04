'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';
import { EventType } from '@prisma/client';
import { EventWithFines } from 'app/admin/boter/page';
import axios from 'axios';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { FineCreate } from 'tihlde/fines';
import { eventTypesMap } from 'utils';

const formatTime = (time: string) =>
  format(new Date(time), "EEEE dd. MMMM' 'HH:mm", {
    locale: nb,
  });

// export type FineAccordionProps = {
//   event: EventWithFines;
// };

// export const FineAccordion = ({ event }: FineAccordionProps) => {
//   const router = useRouter();

//   const getEventTitle = useCallback(
//     (event: EventWithFines) => `${event.title || eventTypesMap[EventType.TRAINING].label} ${formatTime(event.time as unknown as string)}`,
//     [],
//   );

//   const setFinesGiven = useCallback(
//     async (event: EventWithFines, finesGiven: boolean) => {
//       await axios.put(`/api/events/${event.id}`, { data: { finesGiven } });
//       router.refresh();
//     },
//     [router],
//   );

//   const autoGiveFines = useCallback(
//     async (event: EventWithFines) => {
//       const fines: FineCreate[] = event.fines.map((fine) => ({
//         amount: fine.amount,
//         description: fine.description,
//         user: [fine.player.tihlde_user_id],
//         image: null,
//         reason: `${getEventTitle(event)}: ${fine.reason} ${fine.time ? `(${formatTime(fine.time)})` : ''}`,
//       }));
//       await axios.post(`/api/give-fines`, { data: { fines, eventId: event.id } });
//       router.refresh();
//     },
//     [getEventTitle, router],
//   );

//   return (
//     <AccordionItem startContent={event.finesGiven ? '✅' : '❌'} subtitle={`${event.fines.length} spillere`} title={getEventTitle(event)}>
//       <div className='mb-4 flex gap-4'>
//         <Button color='primary' isDisabled={event.finesGiven} onClick={() => autoGiveFines(event)} variant='solid'>
//           Gi bøter automagisk
//         </Button>
//         <Checkbox isSelected={event.finesGiven} onValueChange={(e) => setFinesGiven(event, e)}>
//           Gitt bøter
//         </Checkbox>
//       </div>
//       <Table removeWrapper>
//         <TableHeader>
//           <TableColumn className='font-cabin text-lg text-white'>Navn</TableColumn>
//           <TableColumn className='w-full font-cabin text-lg text-white'>Lovbrudd</TableColumn>
//         </TableHeader>
//         <TableBody emptyContent='Ingen fortjener bot'>
//           {event.fines.map((fine) => (
//             <TableRow key={fine.player.id}>
//               <TableCell className='text-md whitespace-nowrap font-cabin text-white'>{fine.player.name}</TableCell>
//               <TableCell className='text-md whitespace-nowrap font-cabin text-white'>{`${fine.reason} - ${fine.amount} bøter ${
//                 fine.time ? `(${formatTime(fine.time)})` : ''
//               }`}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </AccordionItem>
//   );
// };

export type FinesAccordionProps = {
  events: EventWithFines[];
};

export const FinesAccordion = ({ events }: FinesAccordionProps) => {
  const router = useRouter();

  const getEventTitle = useCallback(
    (event: EventWithFines) => `${event.title || eventTypesMap[EventType.TRAINING].label} ${formatTime(event.time as unknown as string)}`,
    [],
  );

  const setFinesGiven = useCallback(
    async (event: EventWithFines, finesGiven: boolean) => {
      await axios.put(`/api/events/${event.id}`, { data: { finesGiven } });
      router.refresh();
    },
    [router],
  );

  const autoGiveFines = useCallback(
    async (event: EventWithFines) => {
      const fines: FineCreate[] = event.fines.map((fine) => ({
        amount: fine.amount,
        description: fine.description,
        user: [fine.player.tihlde_user_id],
        image: null,
        reason: `${getEventTitle(event)}: ${fine.reason} ${fine.time ? `(${formatTime(fine.time)})` : ''}`,
      }));
      await axios.post(`/api/give-fines`, { data: { fines, eventId: event.id } });
      router.refresh();
    },
    [getEventTitle, router],
  );
  return (
    <Accordion selectionMode='multiple' variant='bordered'>
      {events.map((event) => (
        <AccordionItem key={event.id} startContent={event.finesGiven ? '✅' : '❌'} subtitle={`${event.fines.length} spillere`} title={getEventTitle(event)}>
          <div className='mb-4 flex gap-4'>
            <Button color='primary' isDisabled={event.finesGiven} onClick={() => autoGiveFines(event)} variant='solid'>
              Gi bøter automagisk
            </Button>
            <Checkbox isSelected={event.finesGiven} onValueChange={(e) => setFinesGiven(event, e)}>
              Gitt bøter
            </Checkbox>
          </div>
          <Table removeWrapper>
            <TableHeader>
              <TableColumn className='font-cabin text-lg text-white'>Navn</TableColumn>
              <TableColumn className='w-full font-cabin text-lg text-white'>Lovbrudd</TableColumn>
            </TableHeader>
            <TableBody emptyContent='Ingen fortjener bot'>
              {event.fines.map((fine) => (
                <TableRow key={fine.player.id}>
                  <TableCell className='text-md whitespace-nowrap font-cabin text-white'>{fine.player.name}</TableCell>
                  <TableCell className='text-md whitespace-nowrap font-cabin text-white'>{`${fine.reason} - ${fine.amount} bøter ${
                    fine.time ? `(${formatTime(fine.time)})` : ''
                  }`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
