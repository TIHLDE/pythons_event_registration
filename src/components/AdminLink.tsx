import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export type AdminLinkProps = {
  path: string;
  title: string;
  description: string;
  openInNewTab?: boolean;
};

const AdminLink = ({ path, title, description, openInNewTab }: AdminLinkProps) => {
  return (
    <Stack
      component={Link}
      href={path}
      spacing={1}
      sx={{
        textDecoration: 'none',
        p: 2,
        backgroundColor: '#532E7B',
        cursor: 'pointer',
        borderRadius: 1,
        height: '100%',
      }}
      target={openInNewTab ? '_blank' : undefined}>
      <Typography variant='h2'>{title}</Typography>
      <Typography variant='body1'>{description}</Typography>
    </Stack>
  );
};

export default AdminLink;
