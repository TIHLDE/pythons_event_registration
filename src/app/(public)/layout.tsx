import { ReactNode } from 'react';

import { MainLinkMenu } from '~/components/LinkMenu';

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MainLinkMenu
        routes={[
          { href: '/', label: 'Kalender' },
          { href: '/statistikk', label: 'Statistikk' },
          { href: '/oppmote', label: 'Oppmøte' },
        ]}
      />
      {children}
    </>
  );
};

export default Layout;
