'use client';
import { CssBaseline, ThemeProvider } from '@mui/material';

import NextAppDirEmotionCacheProvider from 'components/ThemeRegistry/EmotionCache';
import theme from 'components/ThemeRegistry/theme';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
