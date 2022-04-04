import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { IEvent, IRegistrations } from "types";
import Stack from "@mui/material/Stack";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import CancelIcon from "@mui/icons-material/Cancel";
import Button from "@mui/material/Button";
import useSWR from "swr";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/router";
import PlayersModal from "components/PlayersModal";

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

type EventProps = {
  eventDetails: IEvent;
};

const Event = ({ eventDetails }: EventProps) => {
  const classes = useStyles();

  const [openRegistratedPlayersModal, setOpenRegistratedPlayersModal] =
    useState(false);
  const handleOpenRegistratedPlayersModal = () =>
    setOpenRegistratedPlayersModal(true);
  const handleCloseRegistratedPlayersModal = () =>
    setOpenRegistratedPlayersModal(false);

  const [openDeregistratedPlayersModal, setOpenDeregistratedPlayersModal] =
    useState(false);
  const handleOpenDeregistratedPlayersModal = () =>
    setOpenDeregistratedPlayersModal(true);
  const handleCloseDeregistratedPlayersModal = () =>
    setOpenDeregistratedPlayersModal(false);
  const router = useRouter();

  const { data: user } = useSWR("user", (key) => {
    const value = localStorage.getItem(key);
    return !!value ? JSON.parse(value) : undefined;
  });

  const userRegistration = eventDetails.registrations.find(
    (registration: IRegistrations) => registration.playerId === user?.id
  );

  const userHasRegistrated = Boolean(userRegistration);
  const {
    handleSubmit,
    control,
    getValues,
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      registration: -1,
      reason: userRegistration?.reason || "",
    },
  });

  const watchRegistration: number | string = watch("registration");

  const [openRegistration, setOpenRegistration] = useState(false);

  const onSubmit = async (formData: { reason: any; registration: string }) => {
    const data = {
      playerId: user.id,
      eventId: eventDetails.id,
      ...(formData.reason && {
        reason: formData.reason,
      }),
    };
    if (userHasRegistrated) {
      console.log(data);
      axios
        .put(`/api/registration/${data.playerId}_${data.eventId}`, {
          data,
          willArrive: formData.registration === "1",
        })
        .then((res) => {
          console.log(res);
          setOpenRegistration(false);
          router.replace(router.asPath);
        });
    } else {
      axios
        .post("/api/registration", {
          data: data,
          willArrive: formData.registration === "1",
        })
        .then((res) => {
          setOpenRegistration(false);
          router.replace(router.asPath);
        });
    }
  };

  const backgroundColor =
    eventDetails.type.slug === "trening"
      ? "#3A2056"
      : eventDetails.type.slug === "kamp"
      ? "#552056"
      : "#563A20";

  return (
    <Stack
      sx={{
        backgroundColor: backgroundColor,
        border: "1px solid white",
        width: "280px",
        height: "auto",
        padding: "12px",
      }}
      spacing={1}
    >
      {eventDetails.type.slug === "trening" && (
        <Typography variant="h6">💪 Trening</Typography>
      )}
      {eventDetails.type.slug === "kamp" && eventDetails.title && (
        <Typography variant="h6">⚽️ {eventDetails.title}</Typography>
      )}
      {eventDetails.type.slug === "sosialt" && eventDetails.title && (
        <Typography variant="h6">🎉 {eventDetails.title}</Typography>
      )}
      {userRegistration?.willArrive && (
        <Typography variant="body2">🤝 Du er påmeldt</Typography>
      )}
      {!userRegistration?.willArrive && userRegistration?.reason && (
        <Typography variant="body2">😓 Du er avmeldt</Typography>
      )}
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={1}>
          <WatchLaterIcon />
          <Typography variant="body1">
            {format(new Date(eventDetails.time), "MM.dd' 'HH:mm")}{" "}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <LocationOnIcon />
          <Typography variant="body1">{eventDetails.location}</Typography>
        </Stack>
      </Stack>
      <Stack direction="row" spacing={1}>
        <PeopleIcon />
        <a className={classes.link}>
          <Typography
            onClick={handleOpenRegistratedPlayersModal}
            variant="body1"
          >
            {eventDetails.willArrive?.length} påmeldte
          </Typography>
        </a>
      </Stack>
      <Stack direction="row" spacing={1}>
        <CancelIcon />
        <a className={classes.link}>
          <Typography
            variant="body1"
            onClick={handleOpenDeregistratedPlayersModal}
          >
            {eventDetails.willNotArrive?.length} avmeldte
          </Typography>
        </a>
      </Stack>

      {openDeregistratedPlayersModal && (
        <PlayersModal
          handleClose={handleCloseDeregistratedPlayersModal}
          open={openDeregistratedPlayersModal}
          registrations={eventDetails?.willNotArrive || []}
          title="Avmeldte"
        />
      )}
      {openRegistratedPlayersModal && (
        <PlayersModal
          handleClose={handleCloseRegistratedPlayersModal}
          open={openRegistratedPlayersModal}
          registrations={eventDetails?.willArrive || []}
          title="Påmeldte"
        />
      )}
      {!openRegistration ? (
        <Button onClick={() => setOpenRegistration(true)} disabled={!user}>
          {userHasRegistrated ? "Endre" : "Registrer"} oppmøte
        </Button>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Controller
              control={control}
              name="registration"
              render={({ field: { value, onChange } }) => (
                <RadioGroup row value={value} onChange={onChange}>
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Kommer"
                  />
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="Kommer ikke"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
          {watchRegistration === "0" && (
            <Controller
              name={"reason"}
              control={control}
              rules={{ required: "Du må oppgi en grunn" }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  required
                  onChange={onChange}
                  value={value}
                  label={"Grunn"}
                />
              )}
            />
          )}
          <Button type="submit">Bekreft</Button>
        </form>
      )}
    </Stack>
  );
};

export default Event;
