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
          p: 2,
          backgroundColor: '#532E7B',
          cursor: 'pointer',
          borderRadius: 1,
          height: '100%',
        }}>
        <Typography variant='h2'>{title}</Typography>
        <Typography variant='body1'>{description}</Typography>
      </Stack>
    </Link>
  );
};

export default AdminLink;
