import { Link } from '@nextui-org/link';
import Image from 'next/image';
import NextLink from 'next/link';

import image from '~/static/images/404.gif';

export default function NotFound() {
  return (
    <>
      <h1 className='mb-4'>404 - Ikke funnet</h1>
      <p className='mb-2'>
        Denne siden finnes ikke{' '}
        <Link as={NextLink} href='/'>
          gå til forsiden
        </Link>
      </p>
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
