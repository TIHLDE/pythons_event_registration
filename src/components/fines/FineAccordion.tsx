'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Checkbox, Divider, FormControlLabel, Stack, Typography } from '@mui/material';
import { EventType } from '@prisma/client';
import { EventWithFines } from 'app/admin/boter/page';
import axios from 'axios';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback } from 'react';
import { FineCreate } from 'tihlde/fines';
import { eventTypesMap } from 'utils';

const formatTime = (time: string) =>
  format(new Date(time), "EEEE dd. MMMM' 'HH:mm", {
    locale: nb,
  });

export type FineAccordionProps = {
  event: EventWithFines;
};

export const FineAccordion = ({ event }: FineAccordionProps) => {
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
    <Accordion sx={{ backgroundColor: '#3A2056' }}>
      <AccordionSummary aria-controls='panel1bh-content' expandIcon={<ExpandMoreIcon />} id='panel1bh-header'>
        <Typography>
          {`${event.finesGiven ? '✅' : '❌'} `}
          {getEventTitle(event)}
          <Typography component='span' sx={{ color: 'text.secondary', ml: 4 }}>
            {event.fines.length} spillere
          </Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction='row' gap={2} sx={{ mb: 2 }}>
          <Button color='info' disabled={event.finesGiven} onClick={() => autoGiveFines(event)} variant='contained'>
            Gi bøter automagisk
          </Button>
          <FormControlLabel control={<Checkbox checked={event.finesGiven} onChange={(e) => setFinesGiven(event, e.target.checked)} />} label='Gitt bøter' />
        </Stack>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: 0.5, columnGap: 2 }}>
          {event.fines.map((fine, index) => (
            <Fragment key={fine.player.id}>
              <Typography variant='body1'>{fine.player.name}</Typography>
              <Typography variant='body1'>
                <>{`${fine.reason} - ${fine.amount} bøter ${fine.time ? `(${formatTime(fine.time)})` : ''}`}</>
              </Typography>
              {index + 1 !== event.fines.length && <Divider sx={{ gridColumn: 'span 2' }} />}
            </Fragment>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
