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
      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        <Grid item sm={3} xs={12}>
          <AdminLink description='Se aktive spillere, og gjøre nødvendige endringer i spillerstallen' path='/admin/spillere' title='👨‍👧 Spillere' />
        </Grid>
        <Grid item sm={3} xs={12}>
          <AdminLink description='Gjør endringer på kommende arrangementer' path='/admin/arrangementer' title='🎉 Arrangementer' />
        </Grid>
        <Grid item sm={3} xs={12}>
          <AdminLink description='Se hvem av gutta som fortjener bøter basert på registrering' path='/admin/boter' title='🤫 Bøter' />
        </Grid>
        <Grid item sm={3} xs={12}>
          <AdminLink description='Opprett, rediger eller slett beskjeder' path='/admin/beskjeder' title='📨 Beskjeder' />
        </Grid>
      </Grid>
    </>
  );
};

export default Admin;
