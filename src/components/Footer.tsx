'use client';

import { Divider, Link, Stack, Typography } from '@mui/material';
import { Player } from '@prisma/client';
import { deleteCookie } from 'cookies-next';
import { stats } from 'stats';
import { AUTH_TOKEN_COOKIE_KEY, USER_STORAGE_KEY } from 'values';

export type FooterProps = { user: Player | undefined };

export const Footer = ({ user }: FooterProps) => {
  const logout = () => {
    deleteCookie(USER_STORAGE_KEY);
    deleteCookie(AUTH_TOKEN_COOKIE_KEY);
    stats.event('logout');
  };
  return (
    <Stack gap={2} sx={{ mx: 0, mt: 4 }}>
      <Divider />
      <Typography align='center'>
        <Link color='secondary' href='https://github.com/TIHLDE/pythons_event_registration/issues/new' rel='noreferrer' target='_blank'>
          Funnet en bug?
        </Link>
        {`  •  `}
        <Link color='secondary' href='https://github.com/TIHLDE/pythons_event_registration' rel='noreferrer' target='_blank'>
          Kildekode
        </Link>
        {user && (
          <>
            {`  •  `}
            <Link color='secondary' href='/' onClick={logout}>
              Logg ut
            </Link>
          </>
        )}
      </Typography>
      <Typography align='center'>
        {'Laget med ⚽️ av '}
        <Link color='secondary' href='https://github.com/olros' rel='noreferrer' target='_blank'>
          Olaf Rosendahl
        </Link>
        {' og '}
        <Link color='secondary' href='https://github.com/maxschau' rel='noreferrer' target='_blank'>
          Max Torre Schau
        </Link>
      </Typography>
    </Stack>
  );
};