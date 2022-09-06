import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Divider } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { IMatch } from 'types';

import MatchStats from 'components/MatchStats';

export const getServerSideProps: GetServerSideProps = async () => {
  const today = new Date();
  const previousMatchesWithoutResult = await prisma.match.findMany({
    where: {
      result: null,
      event: {
        time: {
          lte: today,
        },
      },
    },
    include: {
      statistic: true,
    },
  });

  const previousMatchesWithResult = await prisma.match.findMany({
    where: {
      result: {
        not: null,
      },
      event: {
        time: {
          lte: today,
        },
      },
    },
    include: {
      statistic: true,
    },
  });
  return { props: { previousMatchesWithoutResult, previousMatchesWithResult } };
};

const Match: NextPage = ({ previousMatchesWithoutResult, previousMatchesWithResult }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Kamper - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h2'>Kamper</Typography>
        <Link href='/admin' passHref>
          <Button component='a' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
            Til admin
          </Button>
        </Link>
      </Stack>
      <Stack spacing={2}>
        {previousMatchesWithoutResult?.length > 0 && (
          <Stack spacing={3}>
            <Typography variant='h3'>Kamper som ikke har resultat</Typography>
            {previousMatchesWithoutResult.map((match: IMatch) => (
              <MatchStats key={match.id} match={match} />
            ))}
          </Stack>
        )}
        {previousMatchesWithResult?.length > 0 && (
          <>
            <Divider />
            <Typography variant='h3'>Kamper som har resultat</Typography>
            {previousMatchesWithResult.map((match: IMatch) => (
              <MatchStats key={match.id} match={match} />
            ))}
          </>
        )}
      </Stack>
    </>
  );
};

export default Match;
