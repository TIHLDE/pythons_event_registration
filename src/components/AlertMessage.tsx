import WarningIcon from '@mui/icons-material/Warning';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { INotification } from 'types';

type AlertMessageProps = {
  notification: INotification;
};

const AlertMessage = ({ notification }: AlertMessageProps) => {
  return (
    <Stack direction='row' spacing={2} sx={{ borderLeft: '4px solid white' }}>
      <WarningIcon fontSize='large' sx={{ marginLeft: 2 }} />
      <Stack>
        <Typography variant='body1'>{notification.message}</Typography>
        <Typography variant='body2'>- {notification.author.name}</Typography>
      </Stack>
    </Stack>
  );
};
export default AlertMessage;
