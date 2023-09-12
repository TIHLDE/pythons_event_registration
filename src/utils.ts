import { MatchEventType } from '@prisma/client';
import { addMonths, endOfToday, getMonth, getYear, set, startOfToday } from 'date-fns';
import { ExtendedEvent } from 'functions/event';

export const fetcher = <Type = unknown>(url: string) => fetch(url).then((res) => res.json()) as Promise<Type>;

export type Semester = {
  id: string;
  from: Date;
  to: Date;
  label: string;
};

export const getSemesters = (): Semester[] => {
  const SEMESTERS_DIVIDER_MONTH = 6;
  const initialDate = set(startOfToday(), { year: 2022, month: SEMESTERS_DIVIDER_MONTH, date: 1 });
  const semesters: Semester[] = [
    {
      id: 'H22',
      from: initialDate,
      to: set(endOfToday(), { year: 2022, month: 11, date: 31 }),
      label: `Høst 22`,
    },
  ];

  while (semesters[semesters.length - 1].to < new Date()) {
    const prevSemester = semesters[semesters.length - 1];
    const newFromDate = addMonths(prevSemester.from, SEMESTERS_DIVIDER_MONTH);
    const newToDate = addMonths(prevSemester.to, SEMESTERS_DIVIDER_MONTH);
    semesters.push({
      id: `${getMonth(newFromDate) < SEMESTERS_DIVIDER_MONTH ? 'V' : 'H'}${String(getYear(newFromDate)).substring(2, 4)}`,
      from: newFromDate,
      to: newToDate,
      label: `${getMonth(newFromDate) < SEMESTERS_DIVIDER_MONTH ? 'Vår' : 'Høst'} ${String(getYear(newFromDate)).substring(2, 4)}`,
    });
  }

  return semesters;
};

export const removeFalsyElementsFromObject = (object: Record<string, string>) => {
  const newObject: Record<string, string> = {};
  Object.keys(object).forEach((key) => {
    if (object[key]) {
      newObject[key] = object[key];
    }
  });
  return newObject;
};

export const MATCH_EVENT_TYPES = {
  [MatchEventType.GOAL]: '⚽ Mål',
  [MatchEventType.ASSIST]: '🥈 Assist',
  [MatchEventType.RED_CARD]: '🟥 Rødt kort',
  [MatchEventType.YELLOW_CARD]: '🟨 Gult kort',
  [MatchEventType.MOTM]: '🏅 MOTM',
};

export const stripEmojis = (str: string) =>
  str
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const getEventTitle = (event: ExtendedEvent) => {
  let icon = '❔';
  let title = 'Ukjent type arrangement';
  switch (event.eventTypeSlug) {
    case 'trening':
      icon = '💪';
      title = `Trening`;
      break;
    case 'kamp':
      icon = `⚽️`;
      title = `Kamp mot ${event.title || 'en motstander'}`;
      break;
    case 'sosialt':
      icon = `🎉`;
      title = `${event.title || 'Sosialt'}`;
      break;
  }
  return { icon, title, fullTitle: `${icon} ${title}` };
};
