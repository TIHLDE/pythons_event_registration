import { format, getDate, getHours, getMinutes, getMonth, getYear, set } from 'date-fns';
import { nb } from 'date-fns/locale';
import HttpStatusCode from 'http-status-typed';
import { createEvents, DateArray, EventAttributes } from 'ics';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ExtendedEvent, getEventsWithRegistrations } from 'queries';
import stream, { Readable } from 'stream';
import { promisify } from 'util';
import { getEventTitle } from 'utils';

const createIcsEvents = promisify<EventAttributes[], string | undefined>(createEvents);
const pipeline = promisify(stream.pipeline);

const PRODUCT_ID = 'pythons/ics';

const removeEventWereUserWillNotAttend = (userId: string) => (event: ExtendedEvent) =>
  !event.willNotArrive.some((registration) => registration.player.tihlde_user_id === userId);

const willUserAttendEvent = (userId: string) => (event: ExtendedEvent) =>
  event.willArrive.some((registration) => registration.player.tihlde_user_id === userId);

const dateToIcsDate = (date: Date): DateArray => [getYear(date), getMonth(date) + 1, getDate(date), getHours(date), getMinutes(date)];

const createIcsEvent =
  (userId: string) =>
  (event: ExtendedEvent): EventAttributes => {
    const userWillAttend = willUserAttendEvent(userId)(event);

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
      title: `${userWillAttend ? '' : '[Mangler registrering] '}${getEventTitle(event)}`,
      start: dateToIcsDate(event.time),
      startInputType: 'utc',
      duration: event.eventTypeSlug === 'trening' ? { hours: 1, minutes: 30 } : { hours: 3 },
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
 * Format of url is: `/api/ics/<user_id>.ics`
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { params } = req.query;
    if (!Array.isArray(params) || params.length !== 1 || params[0].length < 5 || params[0].slice(-4) !== '.ics') {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ detail: 'Wrong URL-format' });
    }
    const userId = params[0].split('.')[0];
    const events = await getEventsWithRegistrations({
      query: { from: set(new Date(), { year: 2022, month: 5 }).toISOString(), to: set(new Date(), { year: 2100 }).toISOString() },
    });
    const icsEvents = await createIcsEvents(events.filter(removeEventWereUserWillNotAttend(userId)).map(createIcsEvent(userId)));

    const calendar =
      icsEvents ||
      `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:${PRODUCT_ID}
METHOD:PUBLISH
X-PUBLISHED-TTL:PT1H
END:VCALENDAR`;

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', `attachment; filename=${userId}.ics`);

    res.status(HttpStatusCode.OK);
    await pipeline(Readable.from(Buffer.from(calendar)), res);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
