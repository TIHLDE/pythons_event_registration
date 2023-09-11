import { Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import image from 'static/images/404.gif';

export default function NotFound() {
  return (
    <>
      <Typography gutterBottom variant='h1'>
        404 - Ikke funnet
      </Typography>
      <Typography gutterBottom>
        Denne siden finnes ikke{' '}
        <Typography component={Link} href='/'>
          gå til forsiden
        </Typography>
      </Typography>
      <Image
        alt='Picture of the author'
        sizes='(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw'
        src={image}
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: 640,
          maxHeight: 358,
        }}
      />
    </>
  );
}
