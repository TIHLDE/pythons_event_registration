import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LinkMenu, LinkMenuProps } from '~/components/LinkMenu';

import { ACTIVE_CLUB } from '~/values';

export const metadata: Metadata = {
  title: 'Ligaer - TIHLDE Pythons',
};

const ROUTES: LinkMenuProps['routes'] = Object.entries(ACTIVE_CLUB.leagues).map(([slug, league]) => ({ href: `/ligaer/${slug}`, label: league.name }));

const Leauges = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <LinkMenu routes={ROUTES} />
      {children}
    </>
  );
};

export default Leauges;
