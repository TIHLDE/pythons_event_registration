import { Stack, Typography } from '@mui/material';

import LoadingLogo from 'components/LoadingLogo';

const PageLoader = (label: string) => () => (
  <Stack gap={1} sx={{ alignItems: 'center' }}>
    <LoadingLogo />
    <Typography sx={{ fontStyle: 'italic' }}>{`Laster inn ${label}...`}</Typography>
  </Stack>
);

export default PageLoader;
