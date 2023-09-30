'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormDataProps = {
  user_id: string;
  password: string;
};

const SignIn = () => {
  const { control, handleSubmit, formState } = useForm<FormDataProps>();
  const [error, setError] = useState<string>();
  const router = useRouter();

  const signIn = async (data: FormDataProps) => {
    setError(undefined);
    try {
      await axios.post(`/api/auth`, data);
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.response?.data?.error || (e as Error).message);
    }
  };

  const isLoading = formState.isSubmitting;

  return (
    <>
      <Head>
        <title>Pythons - innlogging</title>
      </Head>
      <form className='m-auto flex w-full flex-col items-center gap-4 py-2 text-center md:w-1/2' onSubmit={handleSubmit(signIn)}>
        <h1 className='font-oswald text-4xl font-bold'>Oppmøte-registrering</h1>
        <p className='text-md'>Du må logge inn med din TIHLDE-bruker før du kan registrere oppmøte på treninger, kamper og sosiale arrangementer.</p>
        {error && <p className='text-md text-danger-500'>{error}</p>}
        <Controller
          control={control}
          name='user_id'
          render={({ field }) => <Input fullWidth isDisabled={isLoading} label='Brukernavn' required variant='faded' {...field} />}
        />
        <Controller
          control={control}
          name='password'
          render={({ field }) => <Input fullWidth isDisabled={isLoading} label='Passord' required type='password' variant='faded' {...field} />}
        />
        <Button color='primary' fullWidth isDisabled={isLoading} type='submit' variant='solid'>
          {isLoading ? 'Logger inn...' : 'Logg inn'}
        </Button>
      </form>
    </>
  );
};

export default SignIn;
