// eslint-disable-no-explicit-any
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";
import { IRegistrations, IPosition, IPlayer } from "types";
import filter from "lodash/filter";
import useSWR from "swr";
import { fetcher } from "utils";
import { Grid } from "@mui/material";

import Image from "next/image";

export type PlayersModalProps = {
  registrations: IRegistrations[];
  open: boolean;
  handleClose: () => void;
  title: string;
};

const PlayersModal = ({
  registrations,
  open,
  handleClose,
  title,
}: PlayersModalProps) => {
  const { data: positions } = useSWR("/api/positions", fetcher);

  const groupedPlayers = positions?.map((position: IPosition) => {
    return {
      ...position,
      players: filter(registrations, ["player.positionId", position.id]),
    };
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Stack
        spacing={2}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          maxWidth: "90%",
          maxHeight: "90%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Stack direction="row" spacing={2}>
          <Image src="/pythons.png" width={25} height={37.625} alt="Logo" />
          <Typography variant="h6">{title}</Typography>
        </Stack>
        {groupedPlayers?.map((pos: any) => (
          <Stack key={pos.id} spacing={1}>
            <Typography sx={{ fontWeight: "bold" }} variant="body1">
              {pos.title} ({pos.players.length})
            </Typography>
            <Grid container justifyContent="space-between" rowSpacing={2}>
              {pos.players.map((registration: IRegistrations) => (
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {registration.player.name}
                  </Typography>
                  {registration.reason && (
                    <Typography variant="body2">
                      - {registration.reason}
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          </Stack>
        ))}
      </Stack>
    </Modal>
  );
};

export default PlayersModal;
