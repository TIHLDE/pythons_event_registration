import { CircularProgress, Stack, Typography } from '@mui/material';

const AdminLoading = async () => {
  return (
    <Stack gap={1} sx={{ alignItems: 'center' }}>
      <CircularProgress />
      <Typography sx={{ fontStyle: 'italic' }}>Laster inn beskjeder</Typography>
    </Stack>
  );
};

export default AdminLoading;
