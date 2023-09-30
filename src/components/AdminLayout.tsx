import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { ReactNode } from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

const AdminLayout =
  (title: string) =>
  ({ children }: { children: ReactNode }) => {
    return (
      <>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='font-oswald text-4xl font-bold md:text-5xl'>{title}</h1>
          <Button as={Link} color='secondary' href='/admin' startContent={<MdOutlineAdminPanelSettings className='h-6 w-6' />} variant='faded'>
            Til admin
          </Button>
        </div>
        {children}
      </>
    );
  };

export default AdminLayout;
