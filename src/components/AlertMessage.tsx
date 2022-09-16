import { Alert } from '@mui/material';
import Typography from '@mui/material/Typography';

import { ExtendedNotification } from 'components/AdminMessage';

type AlertMessageProps = {
  notification: ExtendedNotification;
};

const AlertMessage = ({ notification }: AlertMessageProps) => {
  return (
    <Alert severity='warning' variant='outlined'>
      <Typography gutterBottom variant='body1'>
        {notification.message}
      </Typography>
      <Typography variant='body2'>- {notification.author.name}</Typography>
    </Alert>
  );
};
export default AlertMessage;
