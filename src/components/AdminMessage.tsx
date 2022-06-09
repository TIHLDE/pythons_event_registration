import { Grid, IconButton, Stack, Typography } from "@mui/material";
import { INotification } from "types";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import NewMessage from "./NewMessage";
import { format } from "date-fns";
import axios from "axios";
import { useRouter } from "next/router";

type AdminMessageProps = {
  notification: INotification;
};

const AdminMessage = ({ notification }: AdminMessageProps) => {
  const [editMessage, setEditMessage] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    setEditMessage(true);
  };

  const handleClose = () => {
    setEditMessage(false);
  };

  const deleteMessage = async () => {
    await axios.delete(`/api/notification/${notification.id}`).then(() => {
      router.replace(router.asPath);
    });
  };
  return (
    <>
      {editMessage ? (
        <Grid item xs={12}>
          <NewMessage notification={notification} handleClose={handleClose} />
        </Grid>
      ) : (
        <>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2">{notification.message}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2">{notification.author.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2">
              {format(new Date(notification.expiringDate), "dd.MM.yy HH:mm")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" onClick={handleToggle}>
                <EditIcon />
              </IconButton>
              <IconButton color="primary" onClick={deleteMessage}>
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Grid>
        </>
      )}
    </>
  );
};

export default AdminMessage;
