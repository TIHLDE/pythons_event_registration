import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LinkMenu } from '~/components/LinkMenu';

export const metadata: Metadata = {
  title: 'Ligaer - TIHLDE Pythons',
};

const Leauges = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <LinkMenu
        routes={[
          { href: '/ligaer/tsff', label: 'TSFF' },
          { href: '/ligaer/7dentligaen', label: '7dentligaen' },
        ]}
      />
      {children}
    </>
  );
};

export default Leauges;
