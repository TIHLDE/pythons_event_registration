'use client';

import { Button, Stack, StackProps } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback } from 'react';

export type LinkMenuProps = StackProps & {
  routes: {
    label: string;
    href: string;
  }[];
};

export const LinkMenu = ({ routes, ...props }: LinkMenuProps) => {
  const pathname = usePathname();

  const isCurrentRoute = useCallback((href: string) => href === pathname, [pathname]);

  return (
    <Stack direction='row' gap={1} {...props}>
      {routes.map((route) => (
        <Button
          color='menu'
          component={Link}
          fullWidth
          href={route.href}
          key={route.href}
          size='large'
          sx={{ fontWeight: isCurrentRoute(route.href) ? 'bold' : undefined }}
          variant={isCurrentRoute(route.href) ? 'contained' : 'outlined'}>
          {route.label}
        </Button>
      ))}
    </Stack>
  );
};

export const MainLinkMenu = (props: Omit<LinkMenuProps, 'routes'>) => (
  <LinkMenu
    routes={[
      { href: '/', label: 'Kalender' },
      { href: '/statistikk', label: 'Statistikk' },
      { href: '/oppmote', label: 'Oppmøte' },
    ]}
    {...props}
  />
);
