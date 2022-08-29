import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

export const getServerSideProps: GetServerSideProps = async () => {
  const today = new Date();
  const previousMatches = await prisma.match.findMany({
    where: {
      Event: {
        time: {
          lte: today,
        },
      },
    },
    include: {
      statistic: true,
    },
  });
  console.log(previousMatches);
  return { props: {} };
};

const Match: NextPage = ({}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
    </>
  );
};

export default Match;
