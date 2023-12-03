'use client';

import { Tab, Tabs } from '@nextui-org/tabs';
import type { Key } from '@react-types/shared';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export type LinkMenuProps = {
  routes: {
    label: string;
    href: string;
  }[];
};

export const LinkMenu = ({ routes }: LinkMenuProps) => {
  const pathname = usePathname();

  const findSelectedWithPathname = useCallback(
    (pathname: string) => [...routes].sort((a, b) => b.href.length - a.href.length).find((route) => pathname.startsWith(route.href))?.href ?? pathname,
    [routes],
  );

  const [selected, setSelected] = useState<Key>(() => findSelectedWithPathname(pathname));

  useEffect(() => {
    setSelected(findSelectedWithPathname(pathname));
  }, [findSelectedWithPathname, pathname]);

  return (
    <Tabs
      className='mb-4 font-cabin'
      classNames={{ tabContent: 'group-data-[selected=true]:font-bold' }}
      color='primary'
      fullWidth
      onSelectionChange={setSelected}
      selectedKey={selected}
      size='lg'
      variant='bordered'>
      {routes.map((item) => (
        <Tab as={Link} href={item.href} key={item.href} title={item.label} />
      ))}
    </Tabs>
  );
};
