import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Box, Button, Stack, Typography } from '@mui/material';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

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
  return (
    <>
      <Head>
        <title>Spillere - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h2'>Spillere</Typography>
        <Link href='/admin' passHref>
          <Button component='a' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
            Til admin
          </Button>
        </Link>
      </Stack>
      <Box gap={1} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' } }}>
        {positions.map((position: IPosition) => (
          <PlayersList id={position.id} key={position.id} players={position.Player} title={position.title} />
        ))}
      </Box>
    </>
  );
};

export default Players;
