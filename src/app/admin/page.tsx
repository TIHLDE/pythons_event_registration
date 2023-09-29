import { Kbd } from '@nextui-org/kbd';
import { Metadata } from 'next';

import AdminLink from 'components/AdminLink';

export const metadata: Metadata = {
  title: 'Admin - TIHLDE Pythons',
};

const Admin = () => {
  return (
    <>
      <h1 className='font-oswald mb-4 text-4xl font-bold md:text-5xl'>Admin</h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
      </div>
      <p className='mt-12 hidden text-center text-sm md:block'>
        <span className='font-bold'>Tips!</span> Tast <Kbd keys={['command']}>A</Kbd> for å åpne admin-siden
      </p>
    </>
  );
};

export default Admin;
