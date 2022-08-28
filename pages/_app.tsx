import { CacheProvider, EmotionCache } from '@emotion/react';
import { Divider, Link, Stack, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import createEmotionCache from 'createEmotionCache';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import useSWR from 'swr';
import theme from 'theme';

import { IPlayer } from 'types';

import NavBar from 'components/NavBar';
import SignIn from 'components/SignIn';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();

  useHotkeys('ctrl+a, cmd+a', () => {
    router.push('/admin');
  });
  const { data: user, isValidating } = useSWR<IPlayer | undefined>('user', (key) => {
    const value = localStorage.getItem(key);
    return !!value ? JSON.parse(value) : undefined;
  });

  const logout = () => localStorage.removeItem('user');

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta content='initial-scale=1, width=device-width' name='viewport' />
        <link href='/favicon.ico' rel='shortcut icon' />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth='lg' sx={{ padding: 2 }}>
          <NavBar />
          {isValidating ? null : user ? <Component {...pageProps} /> : <SignIn />}
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
              {isValidating
                ? null
                : user && (
                    <>
                      {`  •  `}
                      <Link color='secondary' href='/' onClick={logout}>
                        Logg ut
                      </Link>
                    </>
                  )}
            </Typography>
          </Stack>
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
}
