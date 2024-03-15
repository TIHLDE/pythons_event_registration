import { neonConfig, Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

import { DATABASE_URL, IS_PRODUCTION } from '~/serverEnv';

// Only Neon hosts support this -- non-deterministic errors otherwise
neonConfig.pipelineConnect = false;

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var, @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let prisma: PrismaClient | undefined;
}

const getPrismaAdapter = () => {
  if (DATABASE_URL.includes('localhost')) return null;
  const pool = new Pool({ connectionString: DATABASE_URL });
  return new PrismaNeon(pool);
};

const getPrismaClient = () => {
  return new PrismaClient({ adapter: getPrismaAdapter(), log: IS_PRODUCTION ? [] : ['query', 'info', 'warn', 'error'] });
};

export const prismaClient = IS_PRODUCTION ? getPrismaClient() : global.prisma || getPrismaClient();

if (!IS_PRODUCTION) {
  global.prisma = prismaClient;
}
