import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { IEvent } from "types";
import { format } from "date-fns";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { useState } from "react";
import EventModal from "components/EventModal";
import ConfirmModal from "components/ConfirmModal";
import axios from "axios";
import { useRouter } from "next/router";

export type AdminEventProps = {
  event: IEvent;
};

const AdminEvent = ({ event }: AdminEventProps) => {
  const [updateEventModal, setUpdateEventModal] = useState(false);
  const handleUpdateEventModal = () => setUpdateEventModal(true);
  const handleCloseUpdateEventModal = () => setUpdateEventModal(false);

  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const handleOpenConfirmModal = () => setOpenConfirmModal(true);
  const handleCloseConfirmModal = () => setOpenConfirmModal(false);

  const router = useRouter();

  const deleteEvent = () => {
    axios.delete(`/api/events/${event.id}`).then(() => {
      router.replace(router.asPath);
      handleCloseConfirmModal();
    });
  };
  const type =
    event.eventTypeSlug === "trening"
      ? { name: "Trening", color: "#0094FF" }
      : event.eventTypeSlug === "kamp"
      ? { name: "Kamp", color: "#0FDC61" }
      : { name: "Sosialt", color: "#FF00C7" };
  return (
    <Stack
      sx={{ backgroundColor: "#3A2056", border: "1px solid white" }}
      spacing={0.5}
    >
      <Stack padding={1} direction="row" justifyContent={"space-between"}>
        <Typography variant="body1" fontWeight={"bold"}>
          Type
        </Typography>
        <Chip label={type.name} sx={{ backgroundColor: type.color }} />
      </Stack>
      {event.title && (
        <Stack padding={1} direction="row" justifyContent={"space-between"}>
          <Typography variant="body1" fontWeight={"bold"}>
            Tittel
          </Typography>
          <Typography variant="body1">{event.title}</Typography>
        </Stack>
      )}
      <Stack padding={1} direction="row" justifyContent={"space-between"}>
        <Typography variant="body1" fontWeight={"bold"}>
          Dato
        </Typography>
        <Typography variant="body1">
          {format(new Date(event.time), "dd.MM")}
        </Typography>
      </Stack>
      <Stack padding={1} direction="row" justifyContent={"space-between"}>
        <Typography variant="body1" fontWeight={"bold"}>
          Tid
        </Typography>
        <Typography variant="body1">
          {format(new Date(event.time), "HH:mm")}
        </Typography>
      </Stack>
      <Stack padding={1} direction="row" justifyContent={"space-between"}>
        <Typography variant="body1" fontWeight={"bold"}>
          Sted
        </Typography>
        <Typography variant="body1">{event.location}</Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Button
          onClick={handleUpdateEventModal}
          size="small"
          sx={{ textAlign: "left", justifyContent: "flex-start" }}
        >
          Endre
        </Button>
        <Button
          size="small"
          sx={{ textAlign: "left", justifyContent: "flex-start" }}
          color="error"
          onClick={() => setOpenConfirmModal(true)}
        >
          Slett
        </Button>
      </Stack>
      {updateEventModal && (
        <EventModal
          event={event}
          handleClose={handleCloseUpdateEventModal}
          open={updateEventModal}
          title="Endre arrangement"
        />
      )}
      {openConfirmModal && (
        <ConfirmModal
          title="Slett arrangement"
          handleClose={handleCloseConfirmModal}
          open={openConfirmModal}
          onConfirm={() => deleteEvent()}
        />
      )}
    </Stack>
  );
};

export default AdminEvent;
