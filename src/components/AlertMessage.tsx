import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { INotification } from "types";
import WarningIcon from "@mui/icons-material/Warning";

type AlertMessageProps = {
  notification: INotification;
};

const AlertMessage = ({ notification }: AlertMessageProps) => {
  return (
    <Stack sx={{ borderLeft: "4px solid white" }} direction="row" spacing={2}>
      <WarningIcon sx={{ marginLeft: 2 }} fontSize="large" />
      <Stack>
        <Typography variant="body1">{notification.message}</Typography>
        <Typography variant="body2">- {notification.author.name}</Typography>
      </Stack>
    </Stack>
  );
};
export default AlertMessage;
