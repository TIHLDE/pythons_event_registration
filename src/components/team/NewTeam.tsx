'use client';

import AddIcon from '@mui/icons-material/AddRounded';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { useDisclosure } from '@nextui-org/use-disclosure';
import { Team } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

export const NewTeam = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, control, reset } = useForm<Pick<Team, 'name'>>();
  const router = useRouter();

  const onSubmit = async (data: Pick<Team, 'name'>) => {
    await axios.post('/api/teams', { data });
    onClose();
    reset();
    router.refresh();
  };

  return (
    <>
      {isOpen ? (
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name={'name'}
            render={({ field: { onChange, value }, fieldState }) => (
              <Input
                autoFocus
                errorMessage={fieldState.error?.message}
                isInvalid={Boolean(fieldState.error?.message)}
                label='Navn'
                onChange={onChange}
                required
                value={value}
                variant='faded'
              />
            )}
            rules={{ required: 'Laget må ha et navn' }}
          />
          <Button color='primary' type='submit' variant='solid'>
            Legg til
          </Button>
        </form>
      ) : (
        <Button color='primary' fullWidth onClick={onOpen} startContent={<AddIcon />} variant='bordered'>
          Nytt lag
        </Button>
      )}
    </>
  );
};
