import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVertRounded';
import { Divider, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Player, Team } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useModal } from 'hooks/useModal';

import ChangePositionModal from 'components/ChangePositionModal';
import ChangeTeamModal from 'components/ChangeTeamModal';

export type PlayersListProps = {
  title: string;
  players: Player[];
  id: number;
  teamId?: Team['id'];
};

type FormDataProps = {
  name: string;
};

const Player = ({ player }: { player: Player }) => {
  const router = useRouter();
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const [editPlayer, setEditPlayer] = useState(false);
  const { modalOpen: positionModalOpen, handleOpenModal: handleOpenPositionModal, handleCloseModal: handleClosePositionModal } = useModal(false);
  const { modalOpen: teamModalOpen, handleOpenModal: handleOpenTeamModal, handleCloseModal: handleCloseTeamModal } = useModal(false);

  const handleContextMenu = (event: { preventDefault: () => void; clientX: number; clientY: number }) => {
    event.preventDefault();
    setContextMenu(contextMenu === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null);
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const removePlayer = async () => {
    const data = { active: false };
    await axios.put(`/api/players/${player.id}}`, { data: data }).then(() => {
      router.replace(router.asPath);
      handleClose();
    });
  };

  const change = () => {
    setEditPlayer(true);
    handleClose();
  };

  const changePosition = () => {
    handleOpenPositionModal();
    handleClose();
  };

  const changeTeam = () => {
    handleOpenTeamModal();
    handleClose();
  };

  const { handleSubmit, control, reset } = useForm<FormDataProps>({
    defaultValues: { name: player.name },
  });

  const onSubmit = async (formData: FormDataProps) => {
    const data = { name: formData.name };
    axios.put(`/api/players/${player.id}`, { data: data }).then(() => {
      setEditPlayer(false);
      reset();
      router.replace(router.asPath);
    });
  };

  return (
    <>
      <Stack direction='row' key={player.id} onContextMenu={handleContextMenu} spacing={1} style={{ cursor: 'context-menu' }}>
        <IconButton id='long-button' onClick={handleContextMenu} size='small' sx={{ width: 24, height: 24 }}>
          <MoreVertIcon />
        </IconButton>
        {editPlayer ? (
          <Stack component='form' gap={0.5} onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <Controller
              control={control}
              name={'name'}
              render={({ field: { onChange, value } }) => <TextField label={'Navn'} onChange={onChange} required size='small' value={value} />}
              rules={{ required: 'Spilleren må ha et navn' }}
            />
            <Button size='small' sx={{ textAlign: 'left', justifyContent: 'flex-start' }} type='submit' variant='contained'>
              Oppdater
            </Button>
          </Stack>
        ) : (
          <Typography variant='body1'>{player.name}</Typography>
        )}
      </Stack>
      {positionModalOpen && <ChangePositionModal handleClose={handleClosePositionModal} open={positionModalOpen} player={player} title='Bytt posisjon' />}
      {teamModalOpen && <ChangeTeamModal handleClose={handleCloseTeamModal} open={teamModalOpen} player={player} title='Bytt lag' />}
      <Menu
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        anchorReference='anchorPosition'
        onClose={handleClose}
        open={contextMenu !== null}>
        <MenuItem onClick={removePlayer}>Fjern {player.name}</MenuItem>
        <MenuItem onClick={change}>Endre navn</MenuItem>
        <MenuItem onClick={changePosition}>Bytt posisjon</MenuItem>
        <MenuItem onClick={changeTeam}>Bytt lag</MenuItem>
      </Menu>
    </>
  );
};

const PlayersList = ({ title, id, players, teamId }: PlayersListProps) => {
  const [openNewPlayerField, setOpenNewPlayerField] = useState(false);
  const { handleSubmit, control, reset } = useForm<FormDataProps>();
  const router = useRouter();

  const onSubmit = async (formData: FormDataProps) => {
    const data = { name: formData.name, positionId: id, teamId };
    axios.post('/api/players', { data: data }).then(() => {
      setOpenNewPlayerField(false);
      reset();
      router.replace(router.asPath);
    });
  };

  return (
    <Stack gap={1} justifyContent='space-between' sx={{ flex: 1, borderRadius: 1, border: '1px solid white', p: 1 }}>
      <Stack gap={1}>
        <Typography variant='h3'>
          {title} ({players.length})
        </Typography>
        {players.map((player: Player) => (
          <Player key={player.id} player={player} />
        ))}
      </Stack>
      {Boolean(teamId) && (
        <Stack gap={1}>
          <Divider sx={{ mt: 1 }} />
          {openNewPlayerField ? (
            <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)}>
              <Controller
                control={control}
                name={'name'}
                render={({ field: { onChange, value } }) => <TextField autoFocus label={'Navn'} onChange={onChange} required size='small' value={value} />}
                rules={{ required: 'Spilleren må ha et navn' }}
              />
              <Button size='small' sx={{ textAlign: 'left', justifyContent: 'flex-start' }} type='submit' variant='contained'>
                Legg til
              </Button>
            </Stack>
          ) : (
            <Button onClick={() => setOpenNewPlayerField(true)} size='small' startIcon={<AddIcon />} sx={{ textAlign: 'left', justifyContent: 'flex-start' }}>
              Ny spiller
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default PlayersList;
