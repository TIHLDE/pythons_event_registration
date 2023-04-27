import { Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { addWeeks, endOfWeek, format, getWeek, parseISO, startOfWeek } from 'date-fns';
import nb from 'date-fns/locale/nb';
import { prisma } from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ExtendedEvent, getAllMatches, getEventsWithRegistrations } from 'queries';
import safeJsonStringify from 'safe-json-stringify';
import { compareTwoStrings } from 'string-similarity';

import { ExtendedNotification } from 'components/AdminMessage';
import AlertMessage from 'components/AlertMessage';
import { CalendarSubscription } from 'components/CalendarSubscription';
import Event from 'components/Event';
import { EventsFilters } from 'components/EventsFilters';
import { MainLinkMenu } from 'components/LinkMenu';
import { MatchModalProps } from 'components/MatchModal';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const notificationsQuery = prisma.notification.findMany({
    where: {
      expiringDate: {
        gt: new Date(),
      },
    },
    orderBy: {
      expiringDate: 'asc',
    },
    include: {
      author: true,
    },
  });

  const [eventsWithRegistrations, allMatches, notifications] = await Promise.all([getEventsWithRegistrations({ query }), getAllMatches(), notificationsQuery]);

  const eventsRelatedMatches = eventsWithRegistrations
    .filter((event) => event.eventTypeSlug === 'kamp')
    .map((event) => {
      const matches = allMatches.filter((match) => match.id !== event.id && compareTwoStrings(event.title || '', match.title || '') > 0.8);
      return { eventId: event.id, matches };
    })
    .reduce<Record<number, MatchModalProps['event'][]>>((obj, item) => ((obj[item.eventId] = item.matches), obj), {});

  return {
    props: {
      eventsRelatedMatches: JSON.parse(safeJsonStringify(eventsRelatedMatches)),
      events: JSON.parse(safeJsonStringify(eventsWithRegistrations)),
      notifications: JSON.parse(safeJsonStringify(notifications)),
    },
  };
};

const getYearWeek = (time: Date) =>
  `Uke ${getWeek(time, { weekStartsOn: 1 })} (${format(startOfWeek(time, { weekStartsOn: 1 }), 'dd.MM', { locale: nb })}-${format(
    endOfWeek(time, { weekStartsOn: 1 }),
    'dd.MM',
    {
      locale: nb,
    },
  )})`;

const Home: NextPage = ({ events, notifications, eventsRelatedMatches }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const groupedEvents = (events as ExtendedEvent[]).reduce((acc, event) => {
    const time = parseISO(event.time as unknown as string);

    const thisYearWeek = getYearWeek(new Date());
    const nextYearWeek = getYearWeek(addWeeks(new Date(), 1));
    let yearWeek = getYearWeek(time);
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
  }, {} as Record<string, Array<ExtendedEvent>>);

  return (
    <>
      <Head>
        <title>Kalender - Pythons</title>
      </Head>
      <MainLinkMenu sx={{ mb: 2 }} />
      <Stack gap={2}>
        {notifications.map((notification: ExtendedNotification) => (
          <AlertMessage key={notification.id} notification={notification} />
        ))}
        <EventsFilters />
        {!events.length && <Typography>Ingen kommende arrangementer</Typography>}
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
    </>
  );
};

export default Home;
