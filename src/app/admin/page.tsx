import { Box, Typography } from '@mui/material';
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
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
        <AdminLink description='Administrer tidligere og kommende arrangementer' path='/admin/arrangementer' title='🎉 Arrangementer' />
        <AdminLink description='Opprett, rediger eller slett beskjeder' path='/admin/beskjeder' title='📨 Beskjeder' />
        <AdminLink description='Se hvem av gutta som fortjener bøter basert på registrering' path='/admin/boter' title='🤫 Bøter' />
        <AdminLink description='Se lag med spillere og gjør endringer i spillerstallen' path='/admin/lag' title='👨‍👧 Lag og spillere' />
        <AdminLink
          description='Sjekk hvem som ikke har gitt bøter siden forrige botfest'
          path='/admin/ikke-gitt-boter'
          title="🥸 Snitches don't get stitches"
        />
        <AdminLink
          description='Se statistikk for hvordan siden brukes'
          openInNewTab
          path='https://stats.olafros.com/public/tihlde-pythons/registrering'
          title='📈 Stats'
        />
      </Box>
    </>
  );
};

export default Admin;
