import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { IPosition } from 'types';

import PlayersList from 'components/PlayersList';

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
          positionId: true,
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
  });

  return { props: { positions } };
};

const Players: NextPage = ({ positions }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Spillere - Pythons</title>
      </Head>
      <Button onClick={() => router.push('/admin')}>Tilbake til admin-side</Button>
      <Grid container sx={{ marginTop: 4 }}>
        {positions.map((position: IPosition) => (
          <Grid item key={position.id} sm={2} xs={12}>
            <PlayersList id={position.id} key={position.id} players={position.Player} title={position.title} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Players;
