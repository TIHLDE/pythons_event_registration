import z from 'zod';

const clientEnvSchema = z.object({
  NEXT_PUBLIC_ACTIVE_CLUB: z.enum(['PYTHONS_HERRER', 'PYTHONS_DAMER']),
});

const getClientEnv = () => {
  const envClient = clientEnvSchema.safeParse({
    NEXT_PUBLIC_ACTIVE_CLUB: process.env.NEXT_PUBLIC_ACTIVE_CLUB,
  });

  if (!envClient.success) {
    console.error(envClient.error.issues);
    throw new Error('There is an error with the client environment variables');
  }
  return envClient.data;
};

export const envClientSchema = getClientEnv();
