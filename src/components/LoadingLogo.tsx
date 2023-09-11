'use client';

import { keyframes } from '@emotion/react';
import { Box } from '@mui/material';
import Image from 'next/image';

const pulsate = keyframes({
  '0%, 100%': {
    transform: 'scale(0.7)',
  },
  '50%': {
    transform: 'scale(1)',
  },
});

const LoadingLogo = () => (
  <Box
    sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', '& img': { animation: `${pulsate} 2s infinite` } }}>
    <Image alt='Logo' height={75.25} src='/pythons.png' width={50} />
  </Box>
);

export default LoadingLogo;
