// eslint-disable-no-explicit-any
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { IEvent, IEventType } from "types";
import useSWR from "swr";
import { fetcher } from "utils";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import axios from "axios";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { setMinutes } from "date-fns";

export type EventModalProps = {
  event?: IEvent;
  open: boolean;
  handleClose: () => void;
  title: string;
};

type FormDataProps = {
  eventTypeSlug: string;
  title?: string;
  time: any;
  location: string;
};

const EventModal = ({ event, open, handleClose, title }: EventModalProps) => {
  const dateTimeFormat = "yyyy-MM-dd'T'HH:mm";
  const { handleSubmit, control, watch } = useForm<FormDataProps>({
    defaultValues: {
      eventTypeSlug: event?.eventTypeSlug || "",
      title: event?.title || "",
      time:
        event && event.time
          ? format(new Date(event.time), dateTimeFormat)
          : format(setMinutes(new Date(), 0), dateTimeFormat),
      location: event?.location || "",
    },
  });
  const { data: eventTypes } = useSWR("/api/eventType", fetcher);
  const watchEventType: string = watch("eventTypeSlug");
  const router = useRouter();

  const onSubmit = async (formData: FormDataProps) => {
    const data = {
      ...formData,
      time: new Date(formData.time),
    };
    if (event) {
      await axios.put(`/api/events/${event.id}`, { data: data }).then((res) => {
        router.replace(router.asPath);
        handleClose();
      });
    } else {
      await axios.post("/api/events", { data: data }).then((res) => {
        router.replace(router.asPath);
        handleClose();
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Stack
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <Typography variant="h5">{title}</Typography>
            <Controller
              control={control}
              name="eventTypeSlug"
              render={({ field }) => (
                <>
                  <InputLabel id="selectType">Type</InputLabel>
                  <Select
                    required
                    id="selectType"
                    placeholder="Type arrangement"
                    {...field}
                    label="Type"
                  >
                    {eventTypes?.map((eventType: IEventType) => (
                      <MenuItem key={eventType.slug} value={eventType.slug}>
                        {eventType.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              )}
            />
            {watchEventType && watchEventType !== "trening" && (
              <Controller
                control={control}
                name="title"
                render={({ field }) => (
                  <TextField
                    required
                    placeholder="Tittel"
                    label={"Tittel"}
                    {...field}
                  />
                )}
              />
            )}
            <Controller
              control={control}
              name="time"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputLabel id="time">Tid</InputLabel>
                  <input
                    value={value}
                    onChange={onChange}
                    id="time"
                    style={{
                      backgroundColor: "transparent",
                      color: "white",
                      height: "30px",
                    }}
                    type="datetime-local"
                  ></input>
                </>
              )}
            />
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <TextField
                  required
                  placeholder="Sted"
                  label={"Sted"}
                  {...field}
                />
              )}
            />
            <Button type="submit">{event ? "Oppdater" : "Opprett"}</Button>
          </Stack>
        </form>
      </Stack>
    </Modal>
  );
};

export default EventModal;
