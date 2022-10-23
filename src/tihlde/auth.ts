import axios, { AxiosRequestConfig } from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { hoursToSeconds } from 'date-fns';
import { prisma } from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { isMemberOfPythonsGroup } from 'tihlde/memberships';
import { AUTH_TOKEN_COOKIE_KEY, TIHLDE_API_URL, USER_STORAGE_KEY } from 'values';

export const getAuthToken = (req: NextApiRequest, res: NextApiResponse): string | undefined => {
  const token = getCookie(AUTH_TOKEN_COOKIE_KEY, { req, res });

  return typeof token === 'string' ? token : undefined;
};

export const getAuthHeaders = (req: NextApiRequest, res: NextApiResponse): Pick<AxiosRequestConfig<unknown>, 'headers'> => {
  const token = getAuthToken(req, res);

  return { headers: { 'x-csrf-token': token } };
};

export const authenticate = async ({ user_id, password }: { user_id: string; password: string }, req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await axios.post<{ token: string }>(`${TIHLDE_API_URL}auth/login/`, { user_id, password });
    const token = response.data.token;
    setCookie(AUTH_TOKEN_COOKIE_KEY, token, { req, res, maxAge: hoursToSeconds(24) * 180 });
    const playerQuery = prisma.player.findFirst({
      where: {
        tihlde_user_id: user_id,
        active: true,
      },
    });
    const [isMemberOfPythons, player] = await Promise.all([isMemberOfPythonsGroup(req, res), playerQuery]);
    if (!isMemberOfPythons) {
      throw Error('Du er ikke medlem av Pythons-gruppen på TIHLDE.org');
    }
    if (!player) {
      throw Error(
        'Det har ikke blitt opprettet en spiller-profil for deg enda. Spiller-profiler oppdateres/genereres automatisk hver hele time basert på hvem som er medlem i Pythons-gruppen på TIHLDE.org',
      );
    }
    console.log(player);
    setCookie(USER_STORAGE_KEY, JSON.stringify(player), { req, res, maxAge: hoursToSeconds(24) * 180 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    deleteCookie(AUTH_TOKEN_COOKIE_KEY, { req, res });
    deleteCookie(USER_STORAGE_KEY, { req, res });
    throw Error(e.response?.data?.detail || e.message || 'Brukernavn eller passord er feil');
  }
};
