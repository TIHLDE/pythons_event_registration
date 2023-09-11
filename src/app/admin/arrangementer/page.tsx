import { Grid } from '@mui/material';
import { prisma } from 'lib/prisma';
import { type ExtendedEvent, getEventsWhereFilter } from 'queries';

import { PageProps } from 'types';

import AdminEvent from 'components/events/AdminEvent';
import { EventsFilters } from 'components/events/EventsFilters';
import { NewEventModal } from 'components/events/NewEventModal';

const getData = async ({ searchParams }: Pick<PageProps, 'searchParams'>) => {
  const events = (await prisma.event.findMany({
    include: {
      team: true,
      match: true,
    },
    ...getEventsWhereFilter({ query: searchParams }),
  })) as ExtendedEvent[];

  return { events };
};

const Players = async ({ searchParams }: PageProps) => {
  const { events } = await getData({ searchParams });
  return (
    <>
      <EventsFilters sx={{ mb: 2 }} />

      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event.id} md={4} sm={6} xs={12}>
            <AdminEvent event={event} />
          </Grid>
        ))}
        <Grid item md={4} sm={6} xs={12}>
          <NewEventModal />
        </Grid>
      </Grid>
    </>
  );
};

export default Players;
