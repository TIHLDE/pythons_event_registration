import { StatsInit } from '@olros/stats';
import { EventType } from '@prisma/client';

import { envClientSchema } from '~/clientEnv';

export type Deadlines = {
  signupBefore: number;
};

export type Fines = {
  noRegistration: number;
  tooLateRegistration: number;
};

export type Rule = {
  paragraph: string;
  deadlines: Deadlines;
  fines: Fines;
};

export type Rules = Partial<Record<EventType, Rule>>;

export type ClubConfig = {
  name: string;
  url: string;
  pythonsGroupSlug: string;
  initialSemester: {
    year: number;
    semester: 'V' | 'H';
  };
  rules: Rules;
  stats: Pick<StatsInit, 'team' | 'project'>;
};

const CLUBS_CONFIG: Record<(typeof envClientSchema)['NEXT_PUBLIC_ACTIVE_CLUB'], ClubConfig> = {
  PYTHONS_HERRER: {
    name: 'Pythons Herrer',
    url: 'https://pythons.tihlde.org',
    pythonsGroupSlug: 'pythons-gutter-a',
    initialSemester: {
      semester: 'H',
      year: 2022,
    },
    rules: {
      [EventType.TRAINING]: {
        paragraph: '§1.01 - Treningsregistrering',
        deadlines: {
          signupBefore: 4,
        },
        fines: {
          noRegistration: 1,
          tooLateRegistration: 1,
        },
      },
      [EventType.MATCH]: {
        paragraph: '§2.01 - Kampregistrering',
        deadlines: {
          signupBefore: 48,
        },
        fines: {
          noRegistration: 2,
          tooLateRegistration: 2,
        },
      },
    },
    stats: { team: 'tihlde-pythons', project: 'registrering' },
  },
  PYTHONS_DAMER: {
    name: 'Pythons Damer',
    url: 'https://pythons-damer.tihlde.org',
    pythonsGroupSlug: 'pythons-jenter',
    initialSemester: {
      semester: 'H',
      year: 2023,
    },
    rules: {
      [EventType.TRAINING]: {
        paragraph: '§1.01 - Treningsregistrering',
        deadlines: {
          signupBefore: 4,
        },
        fines: {
          noRegistration: 1,
          tooLateRegistration: 1,
        },
      },
      [EventType.MATCH]: {
        paragraph: '§2.01 - Kampregistrering',
        deadlines: {
          signupBefore: 48,
        },
        fines: {
          noRegistration: 2,
          tooLateRegistration: 2,
        },
      },
    },
    stats: { team: 'tihlde-pythons', project: 'registrering-damer' },
  },
};

export const ACTIVE_CLUB = CLUBS_CONFIG[envClientSchema.NEXT_PUBLIC_ACTIVE_CLUB];

export const USER_STORAGE_KEY = 'pythons-user';
export const AUTH_TOKEN_COOKIE_KEY = '~/tihlde-pythons-auth-token';
export const TIHLDE_API_URL = 'https://api.tihlde.org/';
