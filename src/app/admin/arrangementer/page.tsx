import { PageProps } from '~/types';

import { type ExtendedEvent, getEventsWhereFilter } from '~/functions/event';
import { prisma } from '~/lib/prisma';

import AdminEvent from '~/components/events/AdminEvent';
import { EventsFilters } from '~/components/events/EventsFilters';
import { NewEventModal } from '~/components/events/NewEventModal';

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
      <EventsFilters />

      <div className='my-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {events.map((event) => (
          <AdminEvent event={event} key={event.id} />
        ))}
      </div>
      <NewEventModal />
    </>
  );
};

export default Players;
