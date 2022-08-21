import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { IPlayer } from 'types';

import { useModal } from 'hooks/useModal';

import ChangePositionModal from 'components/ChangePositionModal';

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

  const { modalOpen, handleOpenModal, handleCloseModal } = useModal(false);

  const handleContextMenu = (event: { preventDefault: () => void; clientX: number; clientY: number }) => {
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
          null,
    );
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
    handleOpenModal();
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
        {editPlayer ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name={'name'}
              render={({ field: { onChange, value } }) => <TextField label={'Navn'} onChange={onChange} required size='small' value={value} />}
              rules={{ required: 'Spilleren må ha et navn' }}
            />
            <Button size='small' sx={{ textAlign: 'left', justifyContent: 'flex-start' }} type='submit'>
              Oppdater
            </Button>
          </form>
        ) : (
          <>
            <Avatar sx={{ width: 24, height: 24, backgroundColor: '#fff' }}>{player.name.split(' ')[0][0]}</Avatar>
            <Typography variant='body1'>{player.name}</Typography>
          </>
        )}
      </Stack>
      {modalOpen && (
        <ChangePositionModal
          defaultValue={player.positionId}
          handleClose={handleCloseModal}
          onConfirm={() => null}
          open={modalOpen}
          player={player}
          title='Bytt posisjon'
        />
      )}
      <Menu
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        anchorReference='anchorPosition'
        onClose={handleClose}
        open={contextMenu !== null}>
        <MenuItem onClick={removePlayer}>Fjern {player.name}</MenuItem>
        <MenuItem onClick={change}>Endre navn</MenuItem>
        <MenuItem onClick={changePosition}>Bytt posisjon</MenuItem>
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
    axios.post('/api/players', { data: data }).then(() => {
      setOpenNewPlayerField(false);
      reset();
      router.replace(router.asPath);
    });
  };

  return (
    <Stack spacing={1}>
      <Typography variant='h5'>
        {title} ({players.length})
      </Typography>
      {players.map((player: IPlayer) => (
        <Player key={player.id} player={player} />
      ))}
      {openNewPlayerField ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name={'name'}
            render={({ field: { onChange, value } }) => <TextField label={'Navn'} onChange={onChange} required size='small' value={value} />}
            rules={{ required: 'Spilleren må ha et navn' }}
          />
          <Button size='small' sx={{ textAlign: 'left', justifyContent: 'flex-start' }} type='submit'>
            Legg til
          </Button>
        </form>
      ) : (
        <Button onClick={() => setOpenNewPlayerField(true)} size='small' startIcon={<AddIcon />} sx={{ textAlign: 'left', justifyContent: 'flex-start' }}>
          Ny spiller
        </Button>
      )}
    </Stack>
  );
};

export default PlayersList;
