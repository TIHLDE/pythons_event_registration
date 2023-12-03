import { Metadata } from 'next';

import { PageProps } from '~/types';

import { login } from '~/functions/auth/login';

import { LoginForm } from '~/components/LoginForm';

export const metadata: Metadata = {
  title: 'Logg inn - TIHLDE Pythons',
};

const Login = ({ searchParams }: Pick<PageProps, 'searchParams'>) => {
  return (
    <>
      <h1 className='mb-4 text-center font-oswald text-4xl font-bold md:text-5xl'>Logg inn</h1>
      <LoginForm action={login(searchParams)} />
    </>
  );
};

export default Login;
