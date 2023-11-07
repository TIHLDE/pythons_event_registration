import { EventType, Player } from '@prisma/client';
import { addYears, format, getDate, getHours, getMinutes, getMonth, getYear, set } from 'date-fns';
import { nb } from 'date-fns/locale';
import HttpStatusCode from 'http-status-typed';
import { createEvents, DateArray, EventAttributes } from 'ics';
import { promisify } from 'util';

import { ExtendedEvent, getEventsWithRegistrations } from '~/functions/event';
import { prisma } from '~/lib/prisma';

import { stats } from '~/stats';
import { getEventTitle } from '~/utils';

const createIcsEvents = promisify<EventAttributes[], string | undefined>(createEvents);

const PRODUCT_ID = 'pythons/ics';

/**
 * A filter which removes events where the player won't attend and matches where the player isn't part of the playing team.
 */
const removeNonRelevantEvents = (player: Player) => (event: ExtendedEvent) =>
  !event.willNotArrive.some((registration) => registration.player.tihlde_user_id === player.tihlde_user_id) &&
  (event.eventType !== EventType.MATCH || event.teamId === player.teamId);

const willUserAttendEvent = (player: Player) => (event: ExtendedEvent) =>
  event.willArrive.some((registration) => registration.player.tihlde_user_id === player.tihlde_user_id);

const dateToIcsDate = (date: Date): DateArray => [getYear(date), getMonth(date) + 1, getDate(date), getHours(date), getMinutes(date)];

const createIcsEvent =
  (player: Player) =>
  (event: ExtendedEvent): EventAttributes => {
    const userWillAttend = willUserAttendEvent(player)(event);

    const description = [
      ...(userWillAttend ? ['🤝 Du er påmeldt'] : []),
      `✅ ${event.willArrive.length} påmeldt`,
      `❌ ${event.willNotArrive.length} avmeldt`,
      `❔ ${event.hasNotResponded.length} har ikke svart`,
      ``,
      `${userWillAttend ? 'Endre' : 'Registrer'} oppmøte på https://pythons.tihlde.org`,
      ``,
      `Sist oppdatert: ${format(new Date(), "EEEE dd. MMMM' 'HH:mm", {
        locale: nb,
      })}`,
    ].join('\n');

    return {
      productId: PRODUCT_ID,
      calName: 'TIHLDE Pythons',
      title: `${userWillAttend ? '' : '[Mangler registrering] '}${getEventTitle(event).fullTitle}`,
      start: dateToIcsDate(event.time),
      startInputType: 'utc',
      duration: event.eventType === EventType.TRAINING ? { hours: 1, minutes: 30 } : { hours: 2 },
      location: event.location,
      created: dateToIcsDate(event.createdAt),
      organizer: { name: 'TIHLDE Pythons', email: 'pythons@tihlde.org', dir: 'https://pythons.tihlde.org' },
      status: 'CONFIRMED',
      description,
    };
  };

/**
 * Generates an ICS-file with the user's events where attendence is true or not registered
 *
 * Format of url is: `/api/ics/[user_id]`
 */
export const GET = async (_: Request, { params }: { params: { user_id: string } }) => {
  const playerQuery = prisma.player.findFirst({
    where: {
      tihlde_user_id: {
        equals: params.user_id,
        mode: 'insensitive',
      },
    },
  });
  const eventsQuery = getEventsWithRegistrations({
    query: { from: set(new Date(), { year: 2022, month: 5 }).toISOString(), to: addYears(new Date(), 2).toISOString() },
  });
  const [player, events] = await Promise.all([playerQuery, eventsQuery]);
  if (!player) {
    return Response.json({ detail: 'Could not find a user with the given user_id' }, { status: HttpStatusCode.BAD_REQUEST });
  }

  stats.event(`Load ics-events at /api/ics/<user_id>`);

  const icsEvents = await createIcsEvents(events.filter(removeNonRelevantEvents(player)).map(createIcsEvent(player)));

  const calendar =
    icsEvents ||
    `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:${PRODUCT_ID}
METHOD:PUBLISH
X-PUBLISHED-TTL:PT1H
END:VCALENDAR`;

  return new Response(calendar, {
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename=${params.user_id}.ics`,
    },
    status: HttpStatusCode.OK,
  });
};
