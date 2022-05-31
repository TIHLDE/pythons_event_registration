// eslint-disable-no-explicit-any
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import useSWR from "swr";
import { fetcher } from "utils";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IPlayer, IPosition } from "types";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import axios from "axios";

export type ChangePositionModalProps = {
  player: IPlayer;
  open: boolean;
  handleClose: () => void;
  title: string;
  onConfirm: () => void;
  defaultValue: number;
};

export type FormDataProps = {
  position: number;
};

const ChangePositionModal = ({
  open,
  handleClose,
  title,
  onConfirm,
  player,
}: ChangePositionModalProps) => {
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: { position: player.positionId },
  });
  const onSubmit = (formData: FormDataProps) => {
    const data = { positionId: formData.position };
    axios.put(`/api/players/${player.id}`, { data: data }).then(() => {
      handleClose();
      router.replace(router.asPath);
    });
  };
  const { data: positions } = useSWR("/api/positions", fetcher);
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Posisjon</InputLabel>
              <Controller
                name="position"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select value={value} label="Posisjon" onChange={onChange}>
                    {positions?.map((position: IPosition) => (
                      <MenuItem key={position.id} value={position.id}>
                        {position.title}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <Stack direction="row" spacing={1} justifyContent="space-between">
              <Button onClick={handleClose} color="error">
                Avbryt
              </Button>
              <Button type="submit" color="success">
                Bytt posisjon
              </Button>
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ChangePositionModal;
