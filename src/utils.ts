import { EventType, MatchEventType, Position } from '@prisma/client';
import { addMonths, endOfToday, getMonth, getYear, set, startOfToday } from 'date-fns';
import { ExtendedEvent } from 'functions/event';

export const fetcher = <Type = unknown>(url: string) => fetch(url).then((res) => res.json()) as Promise<Type>;

export const eventTypesMap = {
  [EventType.MATCH]: { label: 'Kamp' },
  [EventType.SOCIAL]: { label: 'Sosialt' },
  [EventType.TRAINING]: { label: 'Trening' },
} satisfies Record<EventType, { label: string }>;

export const eventTypesList = [
  { type: EventType.MATCH, ...eventTypesMap[EventType.MATCH] },
  { type: EventType.SOCIAL, ...eventTypesMap[EventType.SOCIAL] },
  { type: EventType.TRAINING, ...eventTypesMap[EventType.TRAINING] },
] satisfies { type: EventType; label: string }[];

export const positionsMap = {
  [Position.KEEPER]: { label: 'Keeper', order: 1 },
  [Position.BACK]: { label: 'Back', order: 2 },
  [Position.CENTER_BACK]: { label: 'Midtstopper', order: 3 },
  [Position.MIDTFIELDER]: { label: 'Midtbane', order: 4 },
  [Position.WINGER]: { label: 'Ving', order: 5 },
  [Position.STRIKER]: { label: 'Spiss', order: 6 },
} satisfies Record<Position, { label: string; order: number }>;

export const positionsList = [
  { type: Position.KEEPER, ...positionsMap[Position.KEEPER] },
  { type: Position.BACK, ...positionsMap[Position.BACK] },
  { type: Position.CENTER_BACK, ...positionsMap[Position.CENTER_BACK] },
  { type: Position.MIDTFIELDER, ...positionsMap[Position.MIDTFIELDER] },
  { type: Position.WINGER, ...positionsMap[Position.WINGER] },
  { type: Position.STRIKER, ...positionsMap[Position.STRIKER] },
] satisfies { type: Position; label: string; order: number }[];

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
  switch (event.eventType) {
    case EventType.TRAINING:
      icon = '💪';
      title = `Trening`;
      break;
    case EventType.MATCH:
      icon = `⚽️`;
      title = `Kamp mot ${event.title || 'en motstander'}`;
      break;
    case EventType.SOCIAL:
      icon = `🎉`;
      title = `${event.title || 'Sosialt'}`;
      break;
  }
  return { icon, title, fullTitle: `${icon} ${title}` };
};
