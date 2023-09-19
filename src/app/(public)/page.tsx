import { Stack, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { addWeeks, endOfWeek, format, getWeek, startOfWeek } from 'date-fns';
import nb from 'date-fns/locale/nb';
import { ExtendedEvent, getEventsWithRegistrations } from 'functions/event';
import { getAllMatches } from 'functions/getAllMatches';
import type { Metadata } from 'next';
import { compareTwoStrings } from 'string-similarity';

import { PageProps } from 'types';

import { CalendarSubscription } from 'components/CalendarSubscription';
import Event from 'components/events/Event';
import { EventsFilters } from 'components/events/EventsFilters';
import { MatchModalProps } from 'components/events/MatchModal';
import { ActiveMessages } from 'components/messages/ActiveMessages';

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
    .filter((event) => event.eventTypeSlug === 'kamp')
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
    <Stack gap={2}>
      <ActiveMessages />
      <EventsFilters />
      {!Object.keys(groupedEvents).length && <Typography>Fant ingen arrangementer med denne filtrering</Typography>}
      {Object.keys(groupedEvents).map((group) => (
        <Stack gap={1} key={group}>
          <Typography variant='h3'>{group}</Typography>
          <Grid container spacing={2}>
            {groupedEvents[group].map((event) => (
              <Grid item key={event.id} md={4} sm={6} xs={12}>
                <Event eventDetails={event} relatedMatches={eventsRelatedMatches[event.id] || []} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      ))}
      <CalendarSubscription sx={{ mt: 2 }} />
    </Stack>
  );
};

export default Home;
