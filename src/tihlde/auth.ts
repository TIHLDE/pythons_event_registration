import axios, { AxiosRequestConfig } from 'axios';
import { OptionsType } from 'cookies-next/lib/types';
import { hoursToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { cookies } from 'next/headers';
import { isMemberOfPythonsGroup } from 'tihlde/memberships';
import { AUTH_TOKEN_COOKIE_KEY, TIHLDE_API_URL, USER_STORAGE_KEY } from 'values';

export type NextResponseRequest = Required<Pick<OptionsType, 'req' | 'res'>>;

export const getAuthToken = (): string | undefined => {
  const token = cookies().get(AUTH_TOKEN_COOKIE_KEY);
  return token?.value;
};

export const getAuthHeaders = (): Pick<AxiosRequestConfig<unknown>, 'headers'> => {
  const token = getAuthToken();

  return { headers: { 'x-csrf-token': token } };
};

export const authenticate = async ({ user_id, password }: { user_id: string; password: string }) => {
  try {
    const response = await axios.post<{ token: string }>(`${TIHLDE_API_URL}auth/login/`, { user_id, password });
    const token = response.data.token;
    cookies().set(AUTH_TOKEN_COOKIE_KEY, token, { maxAge: hoursToSeconds(24) * 180 });
    const playerQuery = prisma.player.findFirst({
      where: {
        tihlde_user_id: {
          equals: user_id,
          mode: 'insensitive',
        },
        active: true,
      },
    });
    const [isMemberOfPythons, player] = await Promise.all([isMemberOfPythonsGroup(), playerQuery]);
    if (!isMemberOfPythons) {
      throw Error('Du er ikke medlem av Pythons-gruppen på TIHLDE.org');
    }
    if (!player) {
      throw Error(
        'Det har ikke blitt opprettet en spiller-profil for deg enda. Spiller-profiler oppdateres/genereres automatisk hver hele time basert på hvem som er medlem i Pythons-gruppen på TIHLDE.org',
      );
    }
    cookies().set(USER_STORAGE_KEY, JSON.stringify(player), { maxAge: hoursToSeconds(24) * 180 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    cookies().delete(AUTH_TOKEN_COOKIE_KEY);
    cookies().delete(USER_STORAGE_KEY);
    throw Error(e.response?.data?.detail || e.message || 'Brukernavn eller passord er feil');
  }
};
