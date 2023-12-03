'use client';

import { Button } from '@nextui-org/button';
import { useTransition } from 'react';

import { syncPlayers } from '~/functions/syncPlayers';

import { stats } from '~/stats';

export const RefreshPlayers = () => {
  const [pending, start] = useTransition();

  const onClick = () => {
    stats.event('Sync players manually');
    start(async () => {
      await syncPlayers();
    });
  };
  return (
    <Button color='primary' fullWidth isLoading={pending} onClick={onClick}>
      {pending ? 'Synkroniserer spillere...' : 'Synkroniser spillere'}
    </Button>
  );
};
