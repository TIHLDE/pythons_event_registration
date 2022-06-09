import { ResetTvTwoTone } from "@mui/icons-material";
import { Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { format } from "date-fns";
import router from "next/router";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import { INotification } from "types";

type FormDataProps = {
  message: string;
  expiringDate: any;
};

type NewMessageProps = {
  handleClose: () => void;
  notification?: INotification;
};

const NewMessage = ({ handleClose, notification }: NewMessageProps) => {
  const { data: user } = useSWR("user", (key) => {
    const value = localStorage.getItem(key);
    return !!value ? JSON.parse(value) : undefined;
  });
  const dateTimeFormat = "yyyy-MM-dd'T'HH:mm";
  const { control, reset, handleSubmit } = useForm<FormDataProps>({
    defaultValues: notification
      ? {
          expiringDate: format(
            new Date(notification.expiringDate),
            dateTimeFormat
          ),
          message: notification.message,
        }
      : {
          expiringDate: format(new Date(), dateTimeFormat),
          message: "",
        },
  });
  const onSubmit = async (formData: FormDataProps) => {
    const data = {
      authorId: user.id,
      message: formData.message,
      expiringDate: formData.expiringDate,
    };

    if (notification) {
      await axios
        .put(`/api/notification/${notification.id}`, { data: data })
        .then((res) => {
          router.replace(router.asPath);
          reset();
          handleClose();
        });
    } else {
      await axios.post("/api/notification", { data: data }).then((res) => {
        router.replace(router.asPath);
        reset();
        handleClose();
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row">
        <Controller
          control={control}
          name="message"
          render={({ field }) => (
            <TextField
              required
              sx={{ width: "40%" }}
              variant="standard"
              placeholder="Beskjed"
              label={"Beskjed"}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="expiringDate"
          render={({ field: { onChange, value } }) => (
            <Stack direction="column">
              <InputLabel id="expiringDate">Utløper</InputLabel>
              <input
                value={value}
                onChange={onChange}
                id="expiringDate"
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  height: "30px",
                }}
                type="datetime-local"
              ></input>
            </Stack>
          )}
        />
        <Button sx={{ marginLeft: 4 }} type="submit">
          {notification ? "Oppdater" : "Opprett"}
        </Button>
        <Button sx={{ marginLeft: 2 }} onClick={handleClose}>
          Avbryt
        </Button>
      </Stack>
    </form>
  );
};

export default NewMessage;
