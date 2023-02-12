import { CacheProvider, EmotionCache } from '@emotion/react';
import { Divider, Link, Stack, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Player } from '@prisma/client';
import { deleteCookie, getCookie } from 'cookies-next';
import createEmotionCache from 'createEmotionCache';
import App, { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import { SWRConfig } from 'swr';
import theme from 'theme';
import { AUTH_TOKEN_COOKIE_KEY, USER_STORAGE_KEY } from 'values';

import NavBar from 'components/NavBar';
import SignIn from 'components/SignIn';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}
const PythonsApp = ({ Component, emotionCache = clientSideEmotionCache, pageProps, user }: MyAppProps & { user: Player | undefined }) => {
  const router = useRouter();

  useHotkeys('ctrl+a, cmd+a', () => {
    router.push('/admin');
  });

  const logout = () => {
    deleteCookie(USER_STORAGE_KEY);
    deleteCookie(AUTH_TOKEN_COOKIE_KEY);
  };

  return (
    <SWRConfig value={user ? { fallback: { [`/api/players/${user.id}`]: user } } : undefined}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta content='initial-scale=1, width=device-width' name='viewport' />
          <link href='/favicon.ico' rel='shortcut icon' />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth='lg' sx={{ padding: 2 }}>
            <NavBar user={user} />
            {user ? <Component {...pageProps} /> : <SignIn />}
            <Stack gap={2} sx={{ mx: 0, mt: 4 }}>
              <Divider />
              <Typography align='center'>
                <Link color='secondary' href='https://github.com/TIHLDE/pythons_event_registration/issues/new' rel='noreferrer' target='_blank'>
                  Funnet en bug?
                </Link>
                {`  •  `}
                <Link color='secondary' href='https://github.com/TIHLDE/pythons_event_registration' rel='noreferrer' target='_blank'>
                  Kildekode
                </Link>
                {user && (
                  <>
                    {`  •  `}
                    <Link color='secondary' href='/' onClick={logout}>
                      Logg ut
                    </Link>
                  </>
                )}
              </Typography>
              <Typography align='center'>
                {'Laget med ⚽️ av '}
                <Link color='secondary' href='https://github.com/olros' rel='noreferrer' target='_blank'>
                  Olaf Rosendahl
                </Link>
                {' og '}
                <Link color='secondary' href='https://github.com/maxschau' rel='noreferrer' target='_blank'>
                  Max Torre Schau
                </Link>
              </Typography>
            </Stack>
          </Container>
        </ThemeProvider>
      </CacheProvider>
    </SWRConfig>
  );
};

PythonsApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  const user = getCookie(USER_STORAGE_KEY, appContext.ctx);
  const authToken = getCookie(AUTH_TOKEN_COOKIE_KEY, appContext.ctx);

  return { ...appProps, user: user && authToken ? JSON.parse(user.toString()) : undefined };
};

export default PythonsApp;
