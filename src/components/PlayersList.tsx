import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { IPlayer } from "types";
import { useState } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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

const Player = ({ player }: { player: IPlayer }) => {
  const router = useRouter();
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [editPlayer, setEditPlayer] = useState(false);

  const handleContextMenu = (event: {
    preventDefault: () => void;
    clientX: number;
    clientY: number;
  }) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const removePlayer = async () => {
    const data = { active: false };
    await axios
      .put(`/api/players/${player.id}}`, { data: data })
      .then((res) => {
        router.replace(router.asPath);
        handleClose();
      });
  };

  const change = () => {
    setEditPlayer(true);
    handleClose();
  };

  const { handleSubmit, control, reset } = useForm<FormDataProps>({
    defaultValues: { name: player.name },
  });

  const onSubmit = async (formData: FormDataProps) => {
    const data = { name: formData.name };
    axios.put(`/api/players/${player.id}`, { data: data }).then((res) => {
      setEditPlayer(false);
      reset();
      router.replace(router.asPath);
    });
  };

  return (
    <>
      <Stack
        key={player.id}
        direction="row"
        spacing={1}
        onContextMenu={handleContextMenu}
        style={{ cursor: "context-menu" }}
      >
        {editPlayer ? (
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
              Oppdater
            </Button>
          </form>
        ) : (
          <>
            <Avatar sx={{ width: 24, height: 24, backgroundColor: "#fff" }}>
              {player.name.split(" ")[0][0]}
            </Avatar>
            <Typography variant="body1">{player.name}</Typography>
          </>
        )}
      </Stack>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={removePlayer}>Fjern {player.name}</MenuItem>
        <MenuItem onClick={change}>Rediger</MenuItem>
      </Menu>
    </>
  );
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
        <Player key={player.id} player={player} />
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
