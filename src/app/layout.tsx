import { Container } from '@mui/material';
import { dehydrate } from '@tanstack/react-query';
import { getEventTypes } from 'functions/getEventTypes';
import { getPositions } from 'functions/getPositions';
import { getTeams } from 'functions/getTeams';
import { getSignedInUser } from 'functions/getUser';
import { getQueryClient } from 'getQueryClient';
import { Metadata } from 'next';
import Providers from 'providers';

import { QUERY_CONFIG } from 'hooks/useQuery';

import { AdminHotKeys } from 'components/AdminHotKeys';
import { Analytics } from 'components/Analytics';
import { Footer } from 'components/Footer';
import NavBar from 'components/NavBar';
import SignIn from 'components/SignIn';
import ThemeRegistry from 'components/ThemeRegistry/ThemeRegistry';

export const metadata: Metadata = {
  title: 'TIHLDE Pythons',
  icons: [{ rel: 'shortcut icon', url: '/favicon.ico' }],
  viewport: { width: 'device-width', initialScale: 1 },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSignedInUser();
  const queryClient = getQueryClient();
  if (user) {
    await Promise.all([
      queryClient.prefetchQuery(QUERY_CONFIG.UsePositions().queryKey, getPositions, {}),
      queryClient.prefetchQuery(QUERY_CONFIG.UseTeams().queryKey, getTeams, {}),
      queryClient.prefetchQuery(QUERY_CONFIG.UseEventType().queryKey, getEventTypes, {}),
    ]);
  }
  const dehydratedState = dehydrate(queryClient);
  return (
    <html lang='en'>
      <body>
        <Analytics />
        <ThemeRegistry>
          <Container maxWidth='lg' sx={{ p: 2 }}>
            <Providers dehydratedState={dehydratedState}>
              <NavBar />
              {Boolean(user) && <AdminHotKeys />}
              {user ? children : <SignIn />}
              <Footer />
            </Providers>
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}
