import { Container } from '@mui/material';
import { Player } from '@prisma/client';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { AUTH_TOKEN_COOKIE_KEY, USER_STORAGE_KEY } from 'values';

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

export const getUser = async () => {
  const cookieStore = cookies();
  const user = cookieStore.get(USER_STORAGE_KEY);
  const authToken = cookieStore.get(AUTH_TOKEN_COOKIE_KEY);

  return user && authToken ? (JSON.parse(user.value) as Player) : undefined;
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return (
    <html lang='en'>
      <body>
        <ThemeRegistry>
          <Container maxWidth='lg' sx={{ padding: 2 }}>
            <NavBar user={user} />
            <Analytics />
            <AdminHotKeys />
            {user ? children : <SignIn />}
            <Footer user={user} />
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}
