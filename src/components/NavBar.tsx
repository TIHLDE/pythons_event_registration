import OpenInNewRounded from '@mui/icons-material/OpenInNewRounded';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Player } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

export type NavBarProps = {
  user: Player | undefined;
};

const NavBar = ({ user }: NavBarProps) => {
  return (
    <Stack gap={2} sx={{ mb: 2 }}>
      <Stack direction='row' gap={2} justifyContent='space-between'>
        <Typography sx={{ fontSize: '1rem', display: 'flex', alignItems: 'center' }} variant='h3'>
          {user ? `🏋️‍♂️ ${user.name}` : `Du er ikke innlogget`}
        </Typography>
        <Typography
          component='a'
          href='https://tihlde.org/grupper/pythons-gutter-a/boter/'
          rel='noreferrer'
          sx={{ color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          target='_blank'
          variant='h3'>
          Botinnmelding
          <OpenInNewRounded sx={{ width: '1rem', ml: 0.5 }} />
        </Typography>
      </Stack>
      <Stack alignItems='center' direction='row' justifyContent={'center'}>
        <Link href='/'>
          <Image alt='Logo' height={75.25} src='/pythons.png' width={50} />
        </Link>
      </Stack>
    </Stack>
  );
};

export default NavBar;
