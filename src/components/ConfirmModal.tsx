// eslint-disable-no-explicit-any
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import { IEvent } from "types";
import Button from "@mui/material/Button";

export type EventModalProps = {
  open: boolean;
  handleClose: () => void;
  title: string;
  onConfirm: () => void;
};

type FormDataProps = {
  eventTypeSlug: string;
  title?: string;
  time: any;
  location: string;
};

const ConfirmModal = ({
  open,
  handleClose,
  title,
  onConfirm,
}: EventModalProps) => {
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
        <Stack spacing={2}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="body1">
            Er du sikker på at du vil slette arrangementet?
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Button onClick={handleClose} color="error">
              Nei
            </Button>
            <Button onClick={onConfirm} color="success">
              Ja
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ConfirmModal;
