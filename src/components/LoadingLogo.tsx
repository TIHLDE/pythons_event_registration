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
  <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Box alt='Logo' component={Image} height={75.25} src='/pythons.png' sx={{ animation: `${pulsate} 2s infinite` }} width={50} />
  </Box>
);

export default LoadingLogo;
