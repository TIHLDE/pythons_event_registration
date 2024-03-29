import z from 'zod';

const serverEnvSchema = z.object({
  MOCK_TIHLDE_USER_ID: z.string().trim().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const getServerEnv = () => {
  const envServer = serverEnvSchema.safeParse({
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
export const SHOULD_MOCK_TIHLDE_API = !IS_PRODUCTION && MOCK_TIHLDE_USER_ID;
