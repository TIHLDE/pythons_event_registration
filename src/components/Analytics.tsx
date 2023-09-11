'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { stats } from 'stats';

export const Analytics = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  useEffect(() => {
    stats.pageview();
  }, [pathname, searchParams]);
  return null;
};
