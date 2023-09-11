import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Button, Stack, Typography } from '@mui/material';
import { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Admin Lag - TIHLDE Pythons',
};

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h1'>Lag</Typography>
        <Button color='secondary' component={Link} href='/admin' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
          Til admin
        </Button>
      </Stack>
      {children}
    </>
  );
};

export default AdminLayout;
