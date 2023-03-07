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

export type Rules = Record<string, Rule>;

export const rules: Rules = {
  trening: {
    paragraph: '§1.01 - Treningsregistrering',
    deadlines: {
      signupBefore: 4,
    },
    fines: {
      noRegistration: 1,
      tooLateRegistration: 1,
    },
  },
  kamp: {
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
