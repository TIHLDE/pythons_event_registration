import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Button, List, ListItem, ListItemText, Link as MuiLink, Stack, Typography } from '@mui/material';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import type { TIHLDEUser } from 'tihlde';
import { getAllnotPayedFines } from 'tihlde/fines';
import { getAllPythonsMemberships } from 'tihlde/memberships';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const [{ results: memberships }, { results: notPayedFines }] = await Promise.all([getAllPythonsMemberships({ req, res }), getAllnotPayedFines({ req, res })]);
  const users = memberships.map((membership) => membership.user);

  const usersWithNoCreatedFines = users.filter((user) => !notPayedFines.some((fine) => fine.created_by.user_id === user.user_id));
  const players: Array<TIHLDEUser> = usersWithNoCreatedFines.map((user) => ({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
  }));
  return { props: { players } };
};

const PlayersWithNoCreatedFines = ({ players }: { players: Array<TIHLDEUser> }) => {
  return (
    <>
      <Head>
        <title>Snitches don&apos;t get stitches - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h1'>Snitches don&apos;t get stitches</Typography>
        <Button color='secondary' component={Link} href='/admin' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
          Til admin
        </Button>
      </Stack>
      <Typography sx={{ mb: 1 }}>
        Viser navn på spillere som skal motta bot for brudd på paragraf <i>§10 - Snitches don&apos;t get stitches</i> på bakgrunn av{' '}
        <MuiLink href='https://tihlde.org/grupper/pythons-gutter-a/lovverk/' rel='noreferrer' target='_blank'>
          lovverket
        </MuiLink>
        .
      </Typography>
      {!players.length && <Typography>Alle medlemmer av TIHLDE Pythons har gitt minst 1 bot til enten seg selv eller en annen</Typography>}
      <List dense>
        {players.map((player) => (
          <ListItem divider key={player.user_id}>
            <ListItemText primary={`${player.first_name} ${player.last_name}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default PlayersWithNoCreatedFines;
