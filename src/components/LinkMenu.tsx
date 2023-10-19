'use client';

import { Tab, Tabs } from '@nextui-org/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Key } from 'react';

export type LinkMenuProps = {
  routes: {
    label: string;
    href: string;
  }[];
};

export const MainLinkMenu = ({ routes }: LinkMenuProps) => {
  const pathname = usePathname();
  const [selected, setSelected] = useState<Key>(pathname);

  useEffect(() => {
    if (selected !== pathname) {
      setSelected(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        <Tab as={Link} href={item.href} key={item.href} title={item.label} />
      ))}
    </Tabs>
  );
};
