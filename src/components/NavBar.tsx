import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from 'utils';

import { IPlayer } from 'types';

const NavBar = () => {
  const router = useRouter();
  const { data: players } = useSWR('/api/players', fetcher);

  const { data: user } = useSWR('user', (key) => {
    const value = localStorage.getItem(key);
    return !!value ? JSON.parse(value) : undefined;
  });

  const onPlayerSelect = (player: IPlayer | null) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(player));
      router.reload();
    }
  };

  const toFrontPage = () => {
    router.push('/');
  };
  return (
    <Stack>
      {user ? (
        <Typography>🏋️‍♂️ {user.name}</Typography>
      ) : (
        <Autocomplete
          disablePortal
          getOptionLabel={(option: IPlayer) => option.name}
          id='combo-box-demo'
          noOptionsText='Ingen spillere'
          onChange={(e, value) => onPlayerSelect(value)}
          options={players || []}
          renderInput={(params) => <TextField sx={{ background: 'transparent', color: 'white' }} {...params} label='Spiller' />}
          size='small'
          sx={{ width: 300, color: 'text.primary' }}
        />
      )}
      <Stack alignItems='center' direction='row' justifyContent={'center'}>
        <Image alt='Logo' height={75.25} onClick={toFrontPage} src='/pythons.png' style={{ cursor: 'pointer' }} width={50} />
      </Stack>
    </Stack>
  );
};

export default NavBar;
