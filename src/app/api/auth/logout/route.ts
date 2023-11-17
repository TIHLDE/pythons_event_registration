import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { stats } from '~/stats';
import { AUTH_TOKEN_COOKIE_KEY, USER_STORAGE_KEY } from '~/values';

export const GET = async () => {
  cookies().delete(USER_STORAGE_KEY);
  cookies().delete(AUTH_TOKEN_COOKIE_KEY);
  await stats.event('Log out');

  return redirect('/');
};
