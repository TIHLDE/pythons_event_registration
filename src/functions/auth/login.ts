import { redirect } from 'next/navigation';

import { PageProps } from '~/types';

import { authenticate } from '~/tihlde/auth';

export const login = (searchParams: PageProps['searchParams']) => async (_: unknown, formData: FormData) => {
  'use server';
  const user_id = formData.get('user_id') as string;
  const password = formData.get('password') as string;
  try {
    await authenticate({ user_id, password });
  } catch (e) {
    return { error: (e as Error).message };
  }
  const redirectUrl = searchParams.redirect_url;

  redirect(typeof redirectUrl === 'string' ? redirectUrl : '/');
};
