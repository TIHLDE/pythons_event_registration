import { dehydrate } from '@tanstack/react-query';
import { Metadata, Viewport } from 'next';
import { Cabin, Inter, Oswald } from 'next/font/google';

import { getTeams } from '~/functions/getTeams';
import { getSignedInUser } from '~/functions/getUser';

import { QUERY_CONFIG } from '~/hooks/useQuery';

import { AdminHotKeys } from '~/components/AdminHotKeys';
import { Analytics } from '~/components/Analytics';
import { Footer } from '~/components/Footer';
import NavBar from '~/components/NavBar';

import { getQueryClient } from '~/getQueryClient';
import Providers from '~/providers';

import '~/app/globals.css';

const cabin = Cabin({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cabin',
});

const oswald = Oswald({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-oswald',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TIHLDE Pythons',
  icons: [{ rel: 'shortcut icon', url: '/favicon.ico' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#001328',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSignedInUser();
  const queryClient = getQueryClient();
  if (user) {
    await Promise.all([queryClient.prefetchQuery(QUERY_CONFIG.UseTeams().queryKey, getTeams, {})]);
  }
  const dehydratedState = dehydrate(queryClient);
  return (
    <html className={`dark ${inter.className} ${inter.variable} ${oswald.className} ${oswald.variable} ${cabin.className} ${cabin.variable}`} lang='no'>
      <body>
        <Analytics />
        <Providers dehydratedState={dehydratedState}>
          <div className='mx-auto w-full max-w-screen-lg p-4'>
            <NavBar />
            {Boolean(user) && <AdminHotKeys />}
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
