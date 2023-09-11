import { Container } from '@mui/material';
import { getSignedInUser } from 'functions/getUser';
import { Metadata } from 'next';

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
  return (
    <html lang='en'>
      <body>
        <Analytics />
        <ThemeRegistry>
          <Container maxWidth='lg' sx={{ padding: 2 }}>
            <NavBar />
            {Boolean(user) && <AdminHotKeys />}
            {user ? children : <SignIn />}
            <Footer />
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}
