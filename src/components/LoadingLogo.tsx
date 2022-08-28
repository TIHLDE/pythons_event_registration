import { keyframes } from '@emotion/react';
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
  <div css={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Image alt='Logo' css={{ animation: `${pulsate} 2s infinite` }} height={75.25} src='/pythons.png' width={50} />
  </div>
);

export default LoadingLogo;
