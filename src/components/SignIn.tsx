import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Player, Position } from '@prisma/client';
import { setCookie } from 'cookies-next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from 'utils';
import { USER_STORAGE_KEY } from 'values';

const SignIn = () => {
  const router = useRouter();
  const { data: players = [], isValidating: isPlayersLoading } = useSWR<Player[]>('/api/players', fetcher);
  const { data: positions = [], isValidating: isPositionsLoading } = useSWR<Position[]>('/api/positions', fetcher);

  const onPlayerSelect = (player: Player | null) => {
    if (typeof window !== 'undefined') {
      setCookie(USER_STORAGE_KEY, JSON.stringify(player), { maxAge: 60 * 60 * 24 * 180 });
      router.reload();
    }
  };

  const isLoading = isPlayersLoading || isPositionsLoading;

  return (
    <>
      <Head>
        <title>Pythons - innlogging</title>
      </Head>
      <Stack alignItems='center' gap={2}>
        <Typography variant='h1'>Oppmøte-registrering</Typography>
        <Typography variant='body1'>Du må logge inn før du kan registrere oppmøte på treninger, kamper og sosiale arrangementer.</Typography>
        <Autocomplete
          disabled={isLoading}
          disablePortal
          getOptionLabel={(option) => option.name}
          groupBy={(option) => option.position}
          id='select-player'
          noOptionsText='Fant ingen spillere med dette navnet, kontakt trener-teamet for å bli lagt til'
          onChange={(e, value) => onPlayerSelect(value)}
          options={players
            .sort((a, b) => a.positionId - b.positionId)
            .map((player) => ({ ...player, position: positions.find((pos) => pos.id === player.positionId)?.title || 'Annet' }))}
          renderInput={(params) => (
            <TextField sx={{ background: 'transparent', color: 'white' }} {...params} label={isLoading ? 'Laster spillere...' : 'Velg spiller'} />
          )}
          size='small'
          sx={{ width: '100%', maxWidth: 500, color: 'text.primary' }}
        />
      </Stack>
    </>
  );
};

export default SignIn;
