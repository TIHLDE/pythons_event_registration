import { ReactNode } from 'react';

import { MainLinkMenu } from 'components/LinkMenu';

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <MainLinkMenu sx={{ mb: 2 }} />
      {children}
    </>
  );
};

export default Layout;
