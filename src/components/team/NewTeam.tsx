'use client';

import AddIcon from '@mui/icons-material/AddRounded';
import { Button, Stack, TextField } from '@mui/material';
import { Team } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const NewTeam = () => {
  const [showNewTeam, setShowNewTeam] = useState(false);
  const { handleSubmit, control, reset } = useForm<Pick<Team, 'name'>>();
  const router = useRouter();

  const onSubmit = async (data: Pick<Team, 'name'>) => {
    await axios.post('/api/teams', { data });
    setShowNewTeam(false);
    reset();
    router.refresh();
  };

  return (
    <>
      {showNewTeam ? (
        <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name={'name'}
            render={({ field: { onChange, value } }) => <TextField autoFocus label='Navn' onChange={onChange} required value={value} />}
            rules={{ required: 'Laget må ha et navn' }}
          />
          <Button type='submit' variant='contained'>
            Legg til
          </Button>
        </Stack>
      ) : (
        <Button fullWidth onClick={() => setShowNewTeam(true)} startIcon={<AddIcon />} variant='outlined'>
          Nytt lag
        </Button>
      )}
    </>
  );
};
