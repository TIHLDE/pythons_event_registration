import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { IPlayer } from "types";
import { useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useRouter } from "next/router";

export type PlayersListProps = {
  title: string;
  players: IPlayer[];
  id: number;
};

type FormDataProps = {
  name: string;
};

const PlayersList = ({ title, id, players }: PlayersListProps) => {
  const [openNewPlayerField, setOpenNewPlayerField] = useState(false);
  const { handleSubmit, control, reset } = useForm<FormDataProps>();
  const router = useRouter();

  const onSubmit = async (formData: FormDataProps) => {
    const data = { name: formData.name, positionId: id };
    axios.post("/api/players", { data: data }).then((res) => {
      setOpenNewPlayerField(false);
      reset();
      router.replace(router.asPath);
    });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h5">
        {title} ({players.length})
      </Typography>
      {players.map((player: IPlayer) => (
        <Stack key={player.id} direction="row" spacing={1}>
          <Avatar sx={{ width: 24, height: 24, backgroundColor: "#fff" }}>
            {player.name.split(" ")[0][0]}
          </Avatar>
          <Typography variant="body1">{player.name}</Typography>
        </Stack>
      ))}
      {openNewPlayerField ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name={"name"}
            control={control}
            rules={{ required: "Spilleren må ha et navn" }}
            render={({ field: { onChange, value } }) => (
              <TextField
                required
                onChange={onChange}
                value={value}
                label={"Navn"}
                size="small"
              />
            )}
          />
          <Button
            size="small"
            sx={{ textAlign: "left", justifyContent: "flex-start" }}
            type="submit"
          >
            Legg til
          </Button>
        </form>
      ) : (
        <Button
          onClick={() => setOpenNewPlayerField(true)}
          size="small"
          sx={{ textAlign: "left", justifyContent: "flex-start" }}
          startIcon={<AddIcon />}
        >
          Ny spiller
        </Button>
      )}
    </Stack>
  );
};

export default PlayersList;
