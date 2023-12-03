import { PrismaClient } from '@prisma/client';

import { IS_PRODUCTION } from '~/serverEnv';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var, @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let prisma: PrismaClient | undefined;
}

const getPrismaClient = () => {
  return new PrismaClient({ log: IS_PRODUCTION ? [] : ['query', 'info', 'warn', 'error'] });
};

export const prismaClient = IS_PRODUCTION ? getPrismaClient() : global.prisma || getPrismaClient();

if (!IS_PRODUCTION) {
  global.prisma = prismaClient;
}
