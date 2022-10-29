import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
      router.reload();
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
      <Stack
        alignItems='center'
        component='form'
        gap={2}
        onSubmit={handleSubmit(signIn)}
        sx={{ py: 1, m: 'auto', width: { xs: '100%', md: '50%' } }}
        textAlign='center'>
        <Typography variant='h1'>Oppmøte-registrering</Typography>
        <Typography variant='body1'>
          Du må logge inn med din TIHLDE-bruker før du kan registrere oppmøte på treninger, kamper og sosiale arrangementer.
        </Typography>
        {error && <Typography color='red'>{error}</Typography>}
        <Controller
          control={control}
          name='user_id'
          render={({ field }) => <TextField disabled={isLoading} fullWidth label='Brukernavn' required variant='outlined' {...field} />}
        />
        <Controller
          control={control}
          name='password'
          render={({ field }) => <TextField disabled={isLoading} fullWidth label='Passord' required type='password' variant='outlined' {...field} />}
        />
        <Button disabled={isLoading} fullWidth type='submit' variant='contained'>
          {isLoading ? 'Logger inn...' : 'Logg inn'}
        </Button>
      </Stack>
    </>
  );
};

export default SignIn;
