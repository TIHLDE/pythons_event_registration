import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Button, List, ListItem, ListItemText, Link as MuiLink, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

// eslint-disable-next-line no-restricted-imports
import { User as TIHLDEUser } from '../api/players-with-no-created-fines';

type FormDataProps = {
  username: string;
  password: string;
};

const PlayersWithNoCreatedFines: NextPage = () => {
  const { control, handleSubmit, formState } = useForm<FormDataProps>();
  const [isError, setIsError] = useState(false);
  const [players, setPlayers] = useState<Array<TIHLDEUser> | undefined>(undefined);

  const loadPlayers = async (data: FormDataProps) => {
    setIsError(false);
    try {
      const playersResponse = await axios.post<Array<TIHLDEUser>>(`/api/players-with-no-created-fines`, data);
      setPlayers(playersResponse.data);
      console.log(playersResponse.data);
    } catch {
      setIsError(true);
    }
  };

  const isLoading = formState.isSubmitting;

  return (
    <>
      <Head>
        <title>Snitches don&apos;t get stitches - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h1'>Snitches don&apos;t get stitches</Typography>
        <Link href='/admin' passHref>
          <Button color='secondary' component='a' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
            Til admin
          </Button>
        </Link>
      </Stack>
      <Typography sx={{ mb: 1 }}>
        {players ? 'Viser' : 'Logg inn med din TIHLDE-bruker for å hente ut'} navn på spillere som skal motta bot for brudd på paragraf{' '}
        <i>§10 - Snitches don&apos;t get stitches</i> på bakgrunn av{' '}
        <MuiLink href='https://tihlde.org/grupper/pythons-gutter-a/lovverk/' rel='noreferrer' target='_blank'>
          lovverket
        </MuiLink>
        .
      </Typography>
      {players ? (
        <>
          {!players.length && <Typography>Alle medlemmer av TIHLDE Pythons har gitt minst 1 bot til enten seg selv eller en annen</Typography>}
          <List dense>
            {players.map((player) => (
              <ListItem divider key={player.user_id}>
                <ListItemText primary={`${player.first_name} ${player.last_name}`} />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Paper sx={{ p: 2 }}>
          <Stack component='form' gap={2} onSubmit={handleSubmit(loadPlayers)} sx={{ py: 1 }}>
            {isError && <Typography color='red'>Noe gikk galt. Er du sikker på at brukernavn og passord er riktig?</Typography>}
            <Controller
              control={control}
              name='username'
              render={({ field }) => <TextField disabled={isLoading} label='Brukernavn' required variant='outlined' {...field} />}
            />
            <Controller
              control={control}
              name='password'
              render={({ field }) => <TextField disabled={isLoading} label='Passord' required type='password' variant='outlined' {...field} />}
            />
            <Button disabled={isLoading} type='submit' variant='contained'>
              {isLoading ? 'Laster spillere...' : 'Last spillere'}
            </Button>
          </Stack>
        </Paper>
      )}
    </>
  );
};

export default PlayersWithNoCreatedFines;
