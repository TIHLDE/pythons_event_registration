import { CacheProvider, EmotionCache } from '@emotion/react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import createEmotionCache from 'createEmotionCache';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import theme from 'theme';

import NavBar from 'components/NavBar';

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
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta content='initial-scale=1, width=device-width' name='viewport' />
        <link href='/favicon.ico' rel='shortcut icon' />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Container maxWidth='lg' sx={{ padding: 4 }}>
          <NavBar />
          <Component {...pageProps} />
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
}
