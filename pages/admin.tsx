import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import type { NextPage } from 'next';
import Head from 'next/head';

import AdminLink from 'components/AdminLink';

const Admin: NextPage = () => {
  return (
    <>
      <Head>
        <title>Admin - Pythons</title>
      </Head>
      <Typography sx={{ mb: 2 }} variant='h1'>
        Admin
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <AdminLink description='Se lag med spillere og gjør endringer i spillerstallen' path='/admin/lag' title='👨‍👧 Lag og spillere' />
        </Grid>
        <Grid item sm={6} xs={12}>
          <AdminLink description='Administrer tidligere og kommende arrangementer' path='/admin/arrangementer' title='🎉 Arrangementer' />
        </Grid>
        <Grid item sm={6} xs={12}>
          <AdminLink description='Se hvem av gutta som fortjener bøter basert på registrering' path='/admin/boter' title='🤫 Bøter' />
        </Grid>
        <Grid item sm={6} xs={12}>
          <AdminLink description='Opprett, rediger eller slett beskjeder' path='/admin/beskjeder' title='📨 Beskjeder' />
        </Grid>
        <Grid item sm={6} xs={12}>
          <AdminLink
            description='Sjekk hvem som ikke har gitt bøter siden forrige botfest'
            path='/admin/ikke-gitt-boter'
            title="🥸 Snitches don't get stitches"
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Admin;
