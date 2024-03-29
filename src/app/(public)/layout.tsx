import { ReactNode } from 'react';

import { LinkMenu } from '~/components/LinkMenu';

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <LinkMenu
        routes={[
          { href: '/', label: 'Kalender' },
          { href: '/ligaer', label: 'Ligaer' },
          { href: '/statistikk', label: 'Statistikk' },
        ]}
      />
      {children}
    </>
  );
};

export default Layout;
