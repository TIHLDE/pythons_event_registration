import { PrismaClient } from '@prisma/client';

import { IS_PRODUCTION } from '~/serverEnv';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var, @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (!IS_PRODUCTION) global.prisma = prisma;
