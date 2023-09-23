import { EventType } from '@prisma/client';

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

export const rules: Rules = {
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
};
