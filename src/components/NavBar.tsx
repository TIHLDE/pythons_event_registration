import Stack from "@mui/material/Stack";
import Image from "next/image";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { IPlayer } from "types";
import useSWR from "swr";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { fetcher } from "utils";

const NavBar = () => {
  const router = useRouter();
  const { data: players } = useSWR("/api/players", fetcher);

  const { data: user } = useSWR("user", (key) => {
    const value = localStorage.getItem(key);
    return !!value ? JSON.parse(value) : undefined;
  });

  const onPlayerSelect = (player: IPlayer | null) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(player));
      router.reload();
    }
  };
  return (
    <Stack>
      {user ? (
        <Typography>🏋️‍♂️ {user.name}</Typography>
      ) : (
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={players || []}
          getOptionLabel={(option: IPlayer) => option.name}
          sx={{ width: 300, color: "text.primary" }}
          noOptionsText="Ingen spillere"
          size="small"
          onChange={(e, value) => onPlayerSelect(value)}
          renderInput={(params) => (
            <TextField
              sx={{ background: "transparent", color: "white" }}
              {...params}
              label="Spiller"
            />
          )}
        />
      )}
      <Stack direction="row" justifyContent={"center"} alignItems="center">
        <Image src="/pythons.png" width={50} height={75.25} alt="Logo" />
      </Stack>
    </Stack>
  );
};

export default NavBar;
