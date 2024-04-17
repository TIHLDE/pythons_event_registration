import { EventType, LeadershipRole, MatchEventType, Position } from '@prisma/client';
import { addMonths, endOfMonth, getMonth, getYear, startOfMonth } from 'date-fns';

import { ExtendedEvent } from '~/functions/event';

import { ACTIVE_CLUB } from '~/values';

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

export type LeadershipRoleDetails = { type: LeadershipRole; label: string; order: number };

export const leadershipRolesMap: Record<LeadershipRole, Pick<LeadershipRoleDetails, 'label' | 'order'>> = {
  [LeadershipRole.COACH]: { label: 'Trener', order: 1 },
  [LeadershipRole.ASSISTANT_COACH]: { label: 'Assistenttrener', order: 2 },
  [LeadershipRole.TEAM_LEADER]: { label: 'Lagleder', order: 3 },
  [LeadershipRole.FINES_MANAGER]: { label: 'Botsjef', order: 4 },
  [LeadershipRole.RESERVE_TEAM_COACH]: { label: '7er-trener', order: 5 },
  [LeadershipRole.FINANCE_MANAGER]: { label: 'Økonomiansvarlig', order: 6 },
  [LeadershipRole.SOCIAL_MANAGER]: { label: 'Sosialansvarlig', order: 7 },
  [LeadershipRole.SOME_MANAGER]: { label: 'SoMe-ansvarlig', order: 8 },
};

export const leadershipRolesList = Object.entries(leadershipRolesMap).map(([type, { label, order }]) => ({
  type: type as LeadershipRole,
  label,
  order,
})) satisfies LeadershipRoleDetails[];

export type Semester = {
  id: string;
  from: Date;
  to: Date;
  label: string;
};

export const getSemesters = (): Semester[] => {
  const SEMESTERS_DIVIDER_MONTH = 6;

  const getSemesterIdText = (date: Date) => ({
    id: `${getMonth(date) < SEMESTERS_DIVIDER_MONTH ? 'V' : 'H'}${String(getYear(date)).substring(2, 4)}`,
    label: `${getMonth(date) < SEMESTERS_DIVIDER_MONTH ? 'Vår' : 'Høst'} ${String(getYear(date)).substring(2, 4)}`,
  });

  const firstSemesterStartDate = startOfMonth(new Date(ACTIVE_CLUB.initialSemester));
  const firstSemesterEndDate = endOfMonth(addMonths(new Date(ACTIVE_CLUB.initialSemester), 5));

  const semesters: Semester[] = [
    {
      ...getSemesterIdText(firstSemesterStartDate),
      from: firstSemesterStartDate,
      to: firstSemesterEndDate,
    },
  ];

  while (semesters[semesters.length - 1].to < addMonths(new Date(), 1)) {
    const prevSemester = semesters[semesters.length - 1];
    const newFromDate = startOfMonth(addMonths(prevSemester.from, SEMESTERS_DIVIDER_MONTH));
    const newToDate = endOfMonth(addMonths(prevSemester.to, SEMESTERS_DIVIDER_MONTH));
    semesters.push({
      ...getSemesterIdText(newFromDate),
      from: newFromDate,
      to: newToDate,
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

export const eventTypeBgGradient: Record<EventType, string> = {
  [EventType.MATCH]: 'bg-gradient-to-b from-[#6e2a70] to-[#4c126b]',
  [EventType.TRAINING]: 'bg-gradient-to-b from-[#3A2056] to-[#0b0941]',
  [EventType.SOCIAL]: 'bg-gradient-to-b from-[#565220] to-[#563A20]',
};
