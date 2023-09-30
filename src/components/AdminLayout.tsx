import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { ReactNode } from 'react';

const AdminLayout =
  (title: string) =>
  ({ children }: { children: ReactNode }) => {
    return (
      <>
        <div className='mb-4 flex items-center justify-between'>
          <h1 className='font-oswald text-4xl font-bold md:text-5xl'>{title}</h1>
          <Button as={Link} color='secondary' href='/admin' startContent={<AdminPanelSettingsRoundedIcon />} variant='faded'>
            Til admin
          </Button>
        </div>
        {children}
      </>
    );
  };

export default AdminLayout;
