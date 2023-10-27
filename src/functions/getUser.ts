import 'server-only';

import { Player } from '@prisma/client';
import { cookies } from 'next/headers';

import { getPlayer } from '~/functions/getPlayers';

import { AUTH_TOKEN_COOKIE_KEY, USER_STORAGE_KEY } from '~/values';

export const getSignedInUser = async (): Promise<Player | null> => {
  const userInCookies = cookies().get(USER_STORAGE_KEY);
  const authToken = cookies().get(AUTH_TOKEN_COOKIE_KEY);
  return userInCookies?.value && authToken?.value ? await getPlayer((JSON.parse(userInCookies.value) as Player).id) : null;
};

export const getSignedInUserOrThrow = async (): Promise<Player> => {
  const user = await getSignedInUser();
  if (!user) {
    throw Error('User not signed in');
  }
  return user;
};
