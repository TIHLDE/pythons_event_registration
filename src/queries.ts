import { Prisma } from '@prisma/client';
import { prisma } from 'lib/prisma';
import { NextApiRequest } from 'next';

import { getEventsWhereFilter } from 'components/EventsFilters';

export type ExtendedEvent = Prisma.EventGetPayload<{
  include: {
    registrations: {
      include: {
        player: {
          include: {
            position: true;
          };
        };
      };
    };
    type: true;
    team: true;
    match: true;
  };
}> & {
  willArrive: Prisma.RegistrationsGetPayload<{
    include: {
      player: {
        include: {
          position: true;
        };
      };
    };
  }>[];
  willNotArrive: Prisma.RegistrationsGetPayload<{
    include: {
      player: {
        include: {
          position: true;
        };
      };
    };
  }>[];
  hasNotResponded: Prisma.RegistrationsGetPayload<{
    include: {
      player: {
        include: {
          position: true;
        };
      };
    };
  }>[];
};

export const getEventsWithRegistrations = async ({ query }: Pick<NextApiRequest, 'query'>): Promise<ExtendedEvent[]> => {
  const allFutureEventsQuery = prisma.event.findMany({
    include: {
      team: true,
      match: true,
      type: true,
      registrations: {
        include: {
          player: {
            include: {
              position: true,
            },
          },
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    ...(getEventsWhereFilter({ query }) as {}),
  });

  const playersQuery = prisma.player.findMany({
    where: {
      active: true,
    },
  });

  const [allFutureEvents, players] = await Promise.all([allFutureEventsQuery, playersQuery]);

  const eventsWithRegistrations = allFutureEvents.map((event) => {
    const willArrive = event.registrations.filter((registration) => registration.willArrive);
    const willNotArrive = event.registrations.filter((registration) => !registration.willArrive);

    const hasNotResponded = players
      .filter((player) => !event.teamId || player.teamId === event.teamId)
      .map((player) => {
        const willArriveIds = willArrive.map((p) => p.playerId);
        const willNotArriveIds = willNotArrive.map((p) => p.playerId);
        const playerHasResponded = willArriveIds.includes(player.id) || willNotArriveIds.includes(player.id);

        if (!playerHasResponded) {
          return { player: player, playerId: player.id, willArrive: true };
        }
      })
      .filter(Boolean) as ExtendedEvent['hasNotResponded'];

    return {
      ...event,
      willArrive: willArrive,
      willNotArrive: willNotArrive,
      hasNotResponded: hasNotResponded,
    };
  });

  return eventsWithRegistrations;
};
