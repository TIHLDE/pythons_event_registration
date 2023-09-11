import { Grid, Typography } from '@mui/material';
import { Metadata } from 'next';

import AdminLink from 'components/AdminLink';

export const metadata: Metadata = {
  title: 'Admin - TIHLDE Pythons',
};

const Admin = () => {
  return (
    <>
      <Typography sx={{ mb: 2 }} variant='h1'>
        Admin
      </Typography>
      <Grid container spacing={2}>
        <Grid item sm={6} xs={12}>
          <AdminLink description='Administrer tidligere og kommende arrangementer' path='/admin/arrangementer' title='🎉 Arrangementer' />
        </Grid>
        <Grid item sm={6} xs={12}>
          <AdminLink description='Opprett, rediger eller slett beskjeder' path='/admin/beskjeder' title='📨 Beskjeder' />
        </Grid>
        <Grid item sm={6} xs={12}>
          <AdminLink description='Se hvem av gutta som fortjener bøter basert på registrering' path='/admin/boter' title='🤫 Bøter' />
        </Grid>
        <Grid item sm={6} xs={12}>
          <AdminLink description='Se lag med spillere og gjør endringer i spillerstallen' path='/admin/lag' title='👨‍👧 Lag og spillere' />
        </Grid>
        <Grid item sm={6} xs={12}>
          <AdminLink
            description='Sjekk hvem som ikke har gitt bøter siden forrige botfest (tar tid å laste inn)'
            path='/admin/ikke-gitt-boter'
            title="🥸 Snitches don't get stitches"
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <AdminLink
            description='Se statistikk for hvordan siden brukes'
            openInNewTab
            path='https://stats.olafros.com/public/tihlde-pythons/registrering'
            title='📈 Stats'
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Admin;
