import { Metadata } from 'next';
import Link from 'next/link';

import { PageProps } from '~/types';

export const metadata: Metadata = {
  title: 'Logg inn - TIHLDE Pythons',
};

const Login = ({ searchParams }: Pick<PageProps, 'searchParams'>) => {
  const redirectUrl = typeof searchParams.redirect_url === 'string' ? searchParams.redirect_url : '/';
  const error = typeof searchParams.error === 'string' ? searchParams.error : undefined;

  // Vanlig lenke, ikke fetch: autorisasjonsflyten er en navigasjon, og
  // brukeren skal se tihlde.org i adresselinjen når passordet skrives inn.
  const loginUrl = `/api/auth/login?redirect_url=${encodeURIComponent(redirectUrl)}`;

  return (
    <>
      <h1 className='mb-4 text-center font-oswald text-4xl font-bold md:text-5xl'>Logg inn</h1>
      {error && <p className='mb-4 text-center text-red-500'>{error}</p>}
      <p className='mb-6 text-center'>Du sendes til tihlde.org for å logge inn.</p>
      <Link className='mx-auto block w-fit rounded-md bg-primary px-6 py-3 font-bold text-white' href={loginUrl}>
        Logg inn med TIHLDE
      </Link>
    </>
  );
};

export default Login;
