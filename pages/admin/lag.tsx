import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { Prisma, Team } from '@prisma/client';
import axios from 'axios';
import { prisma } from 'lib/prisma';
import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import ConfirmModal from 'components/ConfirmModal';
import PlayersList from 'components/PlayersList';

type PositionWithPlayer = Prisma.PositionGetPayload<{
  select: {
    id: true;
    name: true;
    Player: true;
    title: true;
  };
}>;

export const getServerSideProps: GetServerSideProps = async () => {
  const teams_list = await prisma.team.findMany();

  const teams = await Promise.all(
    teams_list.map(async (team) => ({
      ...team,
      positions: await prisma.position.findMany({
        select: {
          id: true,
          title: true,
          Player: {
            where: {
              active: true,
              teamId: team.id,
            },
            select: {
              id: true,
              name: true,
              positionId: true,
              teamId: true,
            },
            orderBy: { name: 'asc' },
          },
        },
      }),
    })),
  );

  const players_with_no_team = await prisma.position.findMany({
    select: {
      id: true,
      title: true,
      Player: {
        where: {
          active: true,
          teamId: null,
        },
        select: {
          id: true,
          name: true,
          positionId: true,
          teamId: true,
        },
        orderBy: {
          name: 'asc',
        },
      },
    },
  });

  return { props: { players_with_no_team, teams } };
};

const Teams: NextPage = ({ players_with_no_team, teams }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [openNewTeamField, setOpenNewTeamField] = useState(false);
  const { handleSubmit, control, reset } = useForm<Pick<Team, 'name'>>();
  const router = useRouter();

  const onSubmit = async (data: Pick<Team, 'name'>) => {
    axios.post('/api/teams', { data }).then(() => {
      setOpenNewTeamField(false);
      reset();
      router.replace(router.asPath, undefined, { scroll: false });
    });
  };

  const deleteTeam = (id: Team['id']) => {
    axios.delete(`/api/teams/${id}`).then(() => {
      router.replace(router.asPath, undefined, { scroll: false });
    });
  };

  return (
    <>
      <Head>
        <title>Lag - Pythons</title>
      </Head>
      <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
        <Typography variant='h1'>Lag</Typography>
        <Button color='secondary' component={Link} href='/admin' startIcon={<AdminPanelSettingsRoundedIcon />} variant='outlined'>
          Til admin
        </Button>
      </Stack>
      {teams.map((team: Team & { positions: PositionWithPlayer[] }, index: number) => (
        <Stack gap={1} key={team.id}>
          <Stack direction='row' justifyContent='space-between' sx={{ mb: 2 }}>
            <Typography variant='h2'>{team.name}</Typography>
            <ConfirmModal
              color='error'
              description='Er du helt sikker? Lagets spillere vil ikke berøres, men bli stående uten tilhørighet til et lag.'
              onConfirm={() => deleteTeam(team.id)}
              size='small'
              title='Slett lag'>
              Slett
            </ConfirmModal>
          </Stack>
          <Box gap={1} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' } }}>
            {team.positions.map((position) => (
              <PlayersList key={position.id} players={position.Player} title={position.title} />
            ))}
          </Box>
          {index !== teams.length - 1 && <Divider sx={{ mb: 2, mt: 1 }} />}
        </Stack>
      ))}
      <Divider sx={{ my: 2 }} />
      {openNewTeamField ? (
        <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name={'name'}
            render={({ field: { onChange, value } }) => <TextField autoFocus label={'Navn'} onChange={onChange} required size='small' value={value} />}
            rules={{ required: 'Laget må ha et navn' }}
          />
          <Button size='small' type='submit' variant='contained'>
            Legg til
          </Button>
        </Stack>
      ) : (
        <Button fullWidth onClick={() => setOpenNewTeamField(true)} startIcon={<AddIcon />} variant='outlined'>
          Nytt lag
        </Button>
      )}
      <Typography sx={{ my: 2 }}>
        Ny spillere legges automatisk til her når de legges til i Pythons gruppe på TIHLDE.org. Om spillere fjernes fra Pythons gruppe på TIHLDE.org vil de også
        fjernes her automatisk.
      </Typography>
      {players_with_no_team.some((position: PositionWithPlayer) => position.Player.length) && (
        <>
          <Divider sx={{ my: 2 }} />
          <Stack gap={1}>
            <Typography variant='h2'>Spillere uten lagtilknytning:</Typography>
            <Box gap={1} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' } }}>
              {players_with_no_team.map((position: PositionWithPlayer) => (
                <PlayersList key={position.id} players={position.Player} title={position.title} />
              ))}
            </Box>
          </Stack>
        </>
      )}
    </>
  );
};

export default Teams;
