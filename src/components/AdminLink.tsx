import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export type AdminLinkProps = {
  path: string;
  title: string;
  description: string;
};

const AdminLink = ({ path, title, description }: AdminLinkProps) => {
  return (
    <Link href={path}>
      <Stack
        spacing={1}
        sx={{
          padding: 2,
          width: '80%',
          backgroundColor: '#532E7B',
          cursor: 'pointer',
          borderRadius: '20px',
          height: '100%',
        }}>
        <Typography variant='h5'>{title}</Typography>
        <Typography variant='body1'>{description}</Typography>
      </Stack>
    </Link>
  );
};

export default AdminLink;
