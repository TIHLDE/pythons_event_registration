import { CircularProgress, Stack, Typography } from '@mui/material';

const AdminLoading = async () => {
  return (
    <Stack gap={1} sx={{ alignItems: 'center' }}>
      <CircularProgress />
      <Typography sx={{ fontStyle: 'italic' }}>Laster inn spillere som ikke har gitt andre spillere bøter siden forrige botfest</Typography>
    </Stack>
  );
};

export default AdminLoading;
