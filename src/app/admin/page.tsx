import { Kbd } from '@nextui-org/kbd';
import { Metadata } from 'next';
import Link from 'next/link';

import { ACTIVE_CLUB } from '~/values';

export const metadata: Metadata = {
  title: 'Admin - TIHLDE Pythons',
};

export type AdminLinkProps = {
  path: string;
  title: string;
  description: string;
  openInNewTab?: boolean;
};

const AdminLink = ({ path, title, description, openInNewTab }: AdminLinkProps) => (
  <Link
    className='flex h-full flex-col gap-2 rounded-md bg-primary-900 p-4 no-underline hover:bg-primary-800'
    href={path}
    target={openInNewTab ? '_blank' : undefined}>
    <h2 className='font-oswald text-3xl font-bold'>{title}</h2>
    <p className='text-md'>{description}</p>
  </Link>
);

const Admin = () => {
  return (
    <>
      <h1 className='mb-4 font-oswald text-4xl font-bold md:text-5xl'>Admin</h1>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <AdminLink description='Administrer tidligere og kommende arrangementer' path='/admin/arrangementer' title='🎉 Arrangementer' />
        <AdminLink description='Opprett, rediger eller slett beskjeder' path='/admin/beskjeder' title='📨 Beskjeder' />
        <AdminLink description='Se hvem som fortjener bøter basert på registrering' path='/admin/boter' title='🤫 Bøter' />
        <AdminLink description='Se lag med spillere og gjør endringer i spillerstallen' path='/admin/lag' title='👨‍👧 Lag og spillere' />
        <AdminLink
          description='Sjekk hvem som ikke har gitt bøter siden forrige botfest'
          path='/admin/ikke-gitt-boter'
          title="🥸 Snitches don't get stitches"
        />
        <AdminLink
          description='Se statistikk for hvordan siden brukes'
          openInNewTab
          path={`https://stats.olafros.com/public/${ACTIVE_CLUB.stats.team}/${ACTIVE_CLUB.stats.project}`}
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
