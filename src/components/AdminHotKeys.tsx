'use client';

import { useRouter } from 'next/navigation';
import { useHotkeys } from 'react-hotkeys-hook';
import { stats } from 'stats';

export const AdminHotKeys = () => {
  const router = useRouter();
  useHotkeys('ctrl+a, cmd+a', () => {
    router.push('/admin');
    stats.event('admin-hotkeys');
  });
  return null;
};
