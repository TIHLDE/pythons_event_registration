import { StatsInit } from '@olros/stats';
import { EventType } from '@prisma/client';
import { format, startOfHour } from 'date-fns';
import Image from 'next/image';
import { ReactNode } from 'react';

import { getClientEnv } from '~/clientEnv';
import type { ClientEnvSchema } from '~/clientEnv';

export type Deadlines = {
  /**
   * How many hours before the event starts
   * must the player create a registration
   */
  signupBefore: number;
};

export type Fines = {
  /** How many fines a non-existing registration gives */
  noRegistration: number;
  /** How many fines a late registration gives */
  tooLateRegistration: number;
};

export type Rule = {
  /** Name of paragraph for this rule */
  paragraph: string;
  deadlines: Deadlines;
  fines: Fines;
};

export type Rules = Partial<Record<EventType, Rule>>;

export type League = {
  /** Name of the league */
  name: string;
  /** JSX to be displayed when the league is selected */
  content: ReactNode;
};

type d = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;
type YYYY = `202${d}`;
type MM = `01` | `07`;

export type ClubConfig = {
  /** Name of this club */
  name: string;
  /** URL of the website where this system is hosted for this club */
  url: string;
  /** The club's group-slug at TIHLDE.org */
  pythonsGroupSlug: string;
  /**
   * Set when the club started using this system
   * The date will be translated into its semester
   * E.g.: 2022-01 -> Spring 2022
   */
  initialSemester: `${YYYY}-${MM}`;
  /**
   * Rules config for when the users should recieve fines
   * in the club's fine-system at TIHLDE.org for different event-types
   */
  rules: Rules;
  /**
   * Leagues displayed at /ligaer/:league.
   * The dict-key is used in the URL.
   * They're shown in the same order as in the dict,
   * defaulting to the first.
   */
  leagues: Record<string, League>;
  /** Config for analytics logging to Stats */
  stats: Pick<StatsInit, 'team' | 'project'>;
};

const CLUBS_CONFIG: Record<ClientEnvSchema['NEXT_PUBLIC_ACTIVE_CLUB'], ClubConfig> = {
  PYTHONS_HERRER: {
    name: 'Pythons Herrer',
    url: 'https://pythons.tihlde.org',
    pythonsGroupSlug: 'pythons-gutter-a',
    initialSemester: '2022-07',
    rules: {
      [EventType.TRAINING]: {
        paragraph: '§1.01 - Treningsregistrering',
        deadlines: { signupBefore: 4 },
        fines: { noRegistration: 1, tooLateRegistration: 1 },
      },
      [EventType.MATCH]: {
        paragraph: '§2.01 - Kampregistrering',
        deadlines: { signupBefore: 48 },
        fines: { noRegistration: 2, tooLateRegistration: 2 },
      },
    },
    leagues: {
      tsff: {
        name: 'TSFF',
        content: (
          <>
            <Image
              alt='TSFF tabell'
              className='mx-auto mb-4 max-h-unit-9xl w-auto rounded-md'
              height={1200}
              src={`https://raw.githubusercontent.com/tsff1/tables/main/Scripts/Output/H23/Avd_A_table.png?v=${startOfHour(new Date()).getTime()}`}
              width={850}
            />
            <iframe
              className='mb-4 rounded-md border-none'
              height='750'
              src='https://docs.google.com/spreadsheets/d/e/2PACX-1vQfKRznqZffHTSv1da8lbuuwrklrrQVrwBLsaZdhFeH860KhFmPWnP88z5uoNCSjUjXiZa5dIB16IRg/pubhtml/sheet?gid=0'
              width='100%'
            />
            <p className='text-center text-sm italic'>Hentet fra tsff.no</p>
          </>
        ),
      },
      '7dentligaen': {
        name: '7dentligaen',
        content: (
          <>
            <iframe
              className='mb-4 rounded-md border-none'
              height='750'
              src='https://wp.nif.no/PageTournamentDetailWithMatches.aspx?tournamentId=422366&seasonId=201017&number=all'
              width='100%'
            />
            <p className='text-center text-sm italic'>Hentet fra 7dentligaen</p>
          </>
        ),
      },
    },
    stats: { team: 'tihlde-pythons', project: 'registrering' },
  },
  PYTHONS_DAMER: {
    name: 'Pythons Damer',
    url: 'https://pythons-damer.tihlde.org',
    pythonsGroupSlug: 'pythons-jenter',
    initialSemester: '2024-01',
    rules: {
      [EventType.TRAINING]: {
        paragraph: '§2.01 - Treningsregistrering',
        deadlines: { signupBefore: 4 },
        fines: { noRegistration: 2, tooLateRegistration: 2 },
      },
    },
    leagues: {
      '7dentligaen': {
        name: '7dentligaen',
        content: (
          <>
            <iframe
              className='mb-4 rounded-md border-none'
              height='750'
              src='https://wp.nif.no/PageTournamentDetailWithMatches.aspx?tournamentId=422501&seasonId=201017&number=all'
              width='100%'
            />
            <p className='text-center text-sm italic'>Hentet fra 7dentligaen</p>
          </>
        ),
      },
    },
    stats: { team: 'tihlde-pythons', project: 'registrering-damer' },
  },
};

export const ACTIVE_CLUB = CLUBS_CONFIG[getClientEnv().NEXT_PUBLIC_ACTIVE_CLUB];

export const USER_STORAGE_KEY = 'pythons-user';
export const AUTH_TOKEN_COOKIE_KEY = '~/tihlde-pythons-auth-token';
export const TIHLDE_API_URL = 'https://api.tihlde.org/';

export const MIN_DATE = format(new Date(ACTIVE_CLUB.initialSemester), 'yyyy-MM-dd');
