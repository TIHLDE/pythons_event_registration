import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Container from "@mui/material/Container";
import NavBar from "components/NavBar";
import Grid from "@mui/material/Grid";
import { IEvent, IPosition } from "types";
import { prisma } from "lib/prisma";
import PlayersList from "components/PlayersList";
export const getServerSideProps: GetServerSideProps = async () => {
  const positions = await prisma.position.findMany({
    select: {
      id: true,
      title: true,
      Player: {
        select: {
          id: true,
          name: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  return { props: { positions } };
};

const Players: NextPage = ({
  positions,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(positions);
  return (
    <Container maxWidth="xl" sx={{ padding: 4 }}>
      <NavBar />
      <Grid container sx={{ marginTop: 4 }}>
        {positions.map((position: IPosition) => (
          <Grid item xs={12} sm={2}>
            <PlayersList
              id={position.id}
              title={position.title}
              players={position.Player}
              key={position.id}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Players;
