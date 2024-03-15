import z from 'zod';

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().trim().min(1),
  MOCK_TIHLDE_USER_ID: z.string().trim().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const getServerEnv = () => {
  const envServer = serverEnvSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
    MOCK_TIHLDE_USER_ID: process.env.MOCK_TIHLDE_USER_ID,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!envServer.success) {
    console.error(envServer.error.issues);
    throw new Error('There is an error with the server environment variables');
  }
  return envServer.data;
};

export const IS_PRODUCTION = getServerEnv().NODE_ENV === 'production';
export const MOCK_TIHLDE_USER_ID = getServerEnv().MOCK_TIHLDE_USER_ID;
export const DATABASE_URL = getServerEnv().DATABASE_URL;
export const SHOULD_MOCK_TIHLDE_API = !IS_PRODUCTION && MOCK_TIHLDE_USER_ID;
