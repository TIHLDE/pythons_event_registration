import { redirect } from 'next/navigation';
import { z } from 'zod';

import { PageProps } from '~/types';

import { authenticate } from '~/tihlde/auth';

const loginSchema = z.object({
  user_id: z.string(),
  password: z.string(),
});

export const login = (searchParams: PageProps['searchParams']) => async (_: unknown, formData: FormData) => {
  'use server';
  try {
    const data = loginSchema.parse(Object.fromEntries(formData));
    await authenticate(data);
  } catch (e) {
    return { error: (e as Error).message };
  }
  const redirectUrl = searchParams.redirect_url;

  redirect(typeof redirectUrl === 'string' ? redirectUrl : '/');
};
