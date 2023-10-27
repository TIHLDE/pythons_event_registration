import { ReactNode } from 'react';

import { LinkMenu } from '~/components/LinkMenu';

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <LinkMenu
        routes={[
          { href: '/statistikk', label: 'Statistikk' },
          { href: '/statistikk/oppmote', label: 'Oppmøte' },
        ]}
      />
      {children}
    </>
  );
};

export default Layout;
