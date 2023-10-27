import { EventType } from '@prisma/client';
import { addWeeks, endOfWeek, format, getWeek, startOfWeek } from 'date-fns';
import nb from 'date-fns/locale/nb';
import type { Metadata } from 'next';
import { compareTwoStrings } from 'string-similarity';

import { PageProps } from '~/types';

import { ExtendedEvent, getEventsWithRegistrations } from '~/functions/event';
import { getAllMatches } from '~/functions/getAllMatches';

import { CalendarSubscription } from '~/components/CalendarSubscription';
import Event from '~/components/events/Event';
import { EventsFilters } from '~/components/events/EventsFilters';
import { MatchModalProps } from '~/components/events/MatchModal';
import { ActiveMessages } from '~/components/messages/ActiveMessages';

export const metadata: Metadata = {
  title: 'Kalender - TIHLDE Pythons',
};

const getYearWeek = (time: Date) =>
  `Uke ${getWeek(time, { weekStartsOn: 1, firstWeekContainsDate: 4 })} (${format(startOfWeek(time, { weekStartsOn: 1 }), 'dd.MM', { locale: nb })}-${format(
    endOfWeek(time, { weekStartsOn: 1 }),
    'dd.MM',
    {
      locale: nb,
    },
  )})`;

const getData = async ({ searchParams }: Pick<PageProps, 'searchParams'>) => {
  const [eventsWithRegistrations, allMatches] = await Promise.all([getEventsWithRegistrations({ query: searchParams }), getAllMatches()]);

  const eventsRelatedMatches = eventsWithRegistrations
    .filter((event) => event.eventType === EventType.MATCH)
    .map((event) => {
      const matches = allMatches.filter((match) => match.id !== event.id && compareTwoStrings(event.title || '', match.title || '') > 0.8);
      return { eventId: event.id, matches };
    })
    .reduce<Record<number, MatchModalProps['event'][]>>((obj, item) => ((obj[item.eventId] = item.matches), obj), {});

  const groupedEvents = eventsWithRegistrations.reduce<Record<string, Array<ExtendedEvent>>>((acc, event) => {
    const thisYearWeek = getYearWeek(new Date());
    const nextYearWeek = getYearWeek(addWeeks(new Date(), 1));
    let yearWeek = getYearWeek(event.time);
    if (thisYearWeek === yearWeek) {
      yearWeek = 'Denne uken';
    }
    if (nextYearWeek === yearWeek) {
      yearWeek = 'Neste uke';
    }

    if (!acc[yearWeek]) {
      acc[yearWeek] = [];
    }

    acc[yearWeek].push(event);
    return acc;
  }, {});

  return { eventsRelatedMatches, groupedEvents };
};

const Home = async ({ searchParams }: PageProps) => {
  const { eventsRelatedMatches, groupedEvents } = await getData({ searchParams });

  return (
    <div className='flex flex-col gap-4'>
      <ActiveMessages />
      <EventsFilters />
      {!Object.keys(groupedEvents).length && <p className='text-sm'>Fant ingen arrangementer med denne filtrering</p>}
      {Object.keys(groupedEvents).map((group) => (
        <div className='flex flex-col gap-2' key={group}>
          <h3 className='font-cabin text-2xl'>{group}</h3>
          <div className='grid grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid-cols-3'>
            {groupedEvents[group].map((event) => (
              <Event eventDetails={event} key={event.id} relatedMatches={eventsRelatedMatches[event.id] || []} />
            ))}
          </div>
        </div>
      ))}
      <CalendarSubscription className='mt-4' />
    </div>
  );
};

export default Home;
