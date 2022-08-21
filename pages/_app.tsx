import { CacheProvider, EmotionCache } from '@emotion/react';
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
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta content='initial-scale=1, width=device-width' name='viewport' />
        <link href='/favicon.ico' rel='shortcut icon' />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth='lg' sx={{ padding: 4 }}>
          <NavBar />
          {isValidating ? null : user ? <Component {...pageProps} /> : <SignIn />}
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
}
