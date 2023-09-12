import 'server-only';

import { Prisma } from '@prisma/client';
import { addMonths, isFuture, parseISO, startOfToday } from 'date-fns';
import { getPlayers } from 'functions/getPlayers';
import { prisma } from 'lib/prisma';
import { NextApiRequest } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getSemesters } from 'utils';

export type ExtendedEvent = Prisma.EventGetPayload<{
  include: {
    registrations: {
      include: {
        player: true;
      };
    };
    type: true;
    team: true;
    match: true;
  };
}> & {
  willArrive: Prisma.RegistrationsGetPayload<{
    include: {
      player: true;
    };
  }>[];
  willNotArrive: Prisma.RegistrationsGetPayload<{
    include: {
      player: true;
    };
  }>[];
  hasNotResponded: Prisma.RegistrationsGetPayload<{
    include: {
      player: true;
    };
  }>[];
};

const DEFAULT_FROM_DATE = startOfToday();
const DEFAULT_TO_DATE = addMonths(DEFAULT_FROM_DATE, 4);

export const getEventsWhereFilter = ({ query }: { query: ParsedUrlQuery }): Prisma.EventFindManyArgs => {
  const semesters = getSemesters();
  const semester = typeof query.semester === 'string' && query.semester !== '' ? semesters.find((semester) => semester.id === query.semester) : undefined;
  const dateFrom = semester ? semester.from : typeof query.from === 'string' && query.from !== '' ? parseISO(query.from) : DEFAULT_FROM_DATE;
  const dateTo = semester ? semester.to : typeof query.to === 'string' && query.to !== '' ? parseISO(query.to) : DEFAULT_TO_DATE;
  const eventTypeFilter = semester ? 'kamp' : typeof query.eventType === 'string' && query.eventType !== '' ? query.eventType : undefined;
  const teamFilter = typeof query.team === 'string' && query.team !== '' ? query.team : undefined;

  return {
    where: {
      AND: {
        time: {
          gte: dateFrom,
          lte: dateTo,
        },
        eventTypeSlug: eventTypeFilter ? { in: eventTypeFilter.split(',') } : undefined,
      },
      ...(teamFilter ? { OR: [{ teamId: null }, { teamId: Number(teamFilter) }] } : {}),
    },
    orderBy: {
      time: isFuture(dateTo) ? 'asc' : 'desc',
    },
  };
};

export const getEventsWithRegistrations = async ({ query }: Pick<NextApiRequest, 'query'>): Promise<ExtendedEvent[]> => {
  const allFutureEventsQuery = prisma.event.findMany({
    include: {
      team: true,
      match: true,
      type: true,
      registrations: {
        include: {
          player: true,
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    ...(getEventsWhereFilter({ query }) as {}),
  });

  const [allFutureEvents, activePlayers] = await Promise.all([allFutureEventsQuery, getPlayers()]);

  const eventsWithRegistrations = allFutureEvents.map((event) => {
    const willArrive = event.registrations.filter((registration) => registration.willArrive).sort((a, b) => a.player.name.localeCompare(b.player.name));
    const willNotArrive = event.registrations.filter((registration) => !registration.willArrive).sort((a, b) => a.player.name.localeCompare(b.player.name));

    const hasNotResponded = (
      activePlayers
        .filter((player) => !event.teamId || player.teamId === event.teamId)
        .map((player) => {
          const willArriveIds = willArrive.map((p) => p.playerId);
          const willNotArriveIds = willNotArrive.map((p) => p.playerId);
          const playerHasResponded = willArriveIds.includes(player.id) || willNotArriveIds.includes(player.id);

          if (!playerHasResponded) {
            return { player: player, playerId: player.id, willArrive: true };
          }
        })
        .filter(Boolean) as ExtendedEvent['hasNotResponded']
    ).sort((a, b) => a.player.name.localeCompare(b.player.name));

    return {
      ...event,
      willArrive: willArrive,
      willNotArrive: willNotArrive,
      hasNotResponded: hasNotResponded,
    };
  });

  return eventsWithRegistrations;
};
