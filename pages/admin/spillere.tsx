import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Grid from "@mui/material/Grid";
import { IPosition } from "types";
import { prisma } from "lib/prisma";
import PlayersList from "components/PlayersList";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Head from "next/head";
export const getServerSideProps: GetServerSideProps = async () => {
  const positions = await prisma.position.findMany({
    select: {
      id: true,
      title: true,
      Player: {
        where: {
          active: true,
        },
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
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Spillere - Pythons</title>
      </Head>
      <Button onClick={() => router.push("/admin")}>
        Tilbake til admin-side
      </Button>
      <Grid container sx={{ marginTop: 4 }}>
        {positions.map((position: IPosition) => (
          <Grid key={position.id} item xs={12} sm={2}>
            <PlayersList
              id={position.id}
              title={position.title}
              players={position.Player}
              key={position.id}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Players;
