'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { stats } from '~/stats';

export const Analytics = () => {
  const pathname = usePathname();
  useEffect(() => {
    stats.pageview();
  }, [pathname]);
  return null;
};
