import axios, { AxiosRequestConfig } from 'axios';
import { hoursToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { cookies } from 'next/headers';
import { isMemberOfPythonsGroup } from 'tihlde/memberships';
import { AUTH_TOKEN_COOKIE_KEY, MOCK_TIHLDE_USER_ID, SHOULD_MOCK_TIHLDE_API, TIHLDE_API_URL, USER_STORAGE_KEY } from 'values';

export const getAuthHeaders = (): Pick<AxiosRequestConfig<unknown>, 'headers'> => {
  const token = cookies().get(AUTH_TOKEN_COOKIE_KEY);
  return { headers: { 'x-csrf-token': token?.value } };
};

const loginToTIHLDE = async ({ user_id, password }: AuthenticateParams): Promise<{ token: string }> => {
  if (SHOULD_MOCK_TIHLDE_API) {
    return { token: `-random-tihlde-auth-token-${MOCK_TIHLDE_USER_ID}-` };
  }

  const response = await axios.post<{ token: string }>(`${TIHLDE_API_URL}auth/login/`, { user_id, password });
  return response.data;
};

export type AuthenticateParams = { user_id: string; password: string };

export const authenticate = async ({ user_id, password }: AuthenticateParams) => {
  try {
    const { token } = await loginToTIHLDE({ user_id, password });
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
