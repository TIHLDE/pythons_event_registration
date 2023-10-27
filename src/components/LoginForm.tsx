'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useFormState } from 'react-dom';

import { login } from '~/functions/auth/login';

import { useChildFormStatus } from '~/hooks/useChildFormStatus';

export type LoginFormProps = {
  action: ReturnType<typeof login>;
};

export const LoginForm = ({ action }: LoginFormProps) => {
  const [state, formAction] = useFormState(action, { error: '' });
  const { pending, Listener } = useChildFormStatus();
  return (
    <form action={formAction} className='m-auto flex w-full flex-col items-center gap-4 py-2 text-center md:w-1/2'>
      <p className='text-md'>Du må logge inn med din TIHLDE-bruker før du kan registrere oppmøte på treninger, kamper og sosiale arrangementer.</p>
      {state?.error && <p className='text-md text-danger-500'>{state?.error}</p>}
      <Input fullWidth isDisabled={pending} label='Brukernavn' name='user_id' required variant='faded' />
      <Input fullWidth isDisabled={pending} label='Passord' name='password' required type='password' variant='faded' />
      <Button color='primary' fullWidth isDisabled={pending} type='submit' variant='solid'>
        {pending ? 'Logger inn...' : 'Logg inn'}
      </Button>
      <Listener />
    </form>
  );
};
