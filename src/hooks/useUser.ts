import { Player } from '@prisma/client';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from 'utils';
import { USER_STORAGE_KEY } from 'values';

const getStoredUser = () => {
  const user = getCookie(USER_STORAGE_KEY);
  return user ? (JSON.parse(user.toString()) as Player) : undefined;
};

export const useUser = () => {
  const [storedUser, setStoredUser] = useState(getStoredUser());

  useEffect(() => setStoredUser(getStoredUser()), []);

  return useSWR<Player>(`/api/players/${storedUser?.id}`, fetcher, {
    fallbackData: storedUser,
    isPaused: () => !storedUser,
    onSuccess: (data) => {
      setCookie(USER_STORAGE_KEY, JSON.stringify(data), { maxAge: 60 * 60 * 24 * 180 });
    },
  });
};
