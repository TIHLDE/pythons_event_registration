import MoreVertIcon from '@mui/icons-material/MoreVertRounded';
import { IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { Player } from '@prisma/client';
import { useState } from 'react';

import { useModal } from 'hooks/useModal';

import ChangePositionModal from 'components/ChangePositionModal';
import ChangeTeamModal from 'components/ChangeTeamModal';

export type PlayersListProps = {
  title: string;
  players: Player[];
};

const Player = ({ player }: { player: Player }) => {
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const { modalOpen: positionModalOpen, handleOpenModal: handleOpenPositionModal, handleCloseModal: handleClosePositionModal } = useModal(false);
  const { modalOpen: teamModalOpen, handleOpenModal: handleOpenTeamModal, handleCloseModal: handleCloseTeamModal } = useModal(false);

  const handleContextMenu = (event: { preventDefault: () => void; clientX: number; clientY: number }) => {
    event.preventDefault();
    setContextMenu(contextMenu === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null);
  };

  const closeMenu = () => {
    setContextMenu(null);
  };

  const changePosition = () => {
    handleOpenPositionModal();
    closeMenu();
  };

  const changeTeam = () => {
    handleOpenTeamModal();
    closeMenu();
  };

  return (
    <>
      <Stack direction='row' key={player.id} onContextMenu={handleContextMenu} spacing={1} style={{ cursor: 'context-menu' }}>
        <IconButton id='long-button' onClick={handleContextMenu} size='small' sx={{ width: 24, height: 24 }}>
          <MoreVertIcon />
        </IconButton>
        <Typography variant='body1'>{player.name}</Typography>
      </Stack>
      {positionModalOpen && (
        <ChangePositionModal
          description={`Bestem hvilken posisjon ${player.name} skal kategoriseres under`}
          handleClose={handleClosePositionModal}
          open={positionModalOpen}
          player={player}
          title='Bytt posisjon'
        />
      )}
      {teamModalOpen && (
        <ChangeTeamModal
          description={`Bestem hvilket lag ${player.name} tilhører`}
          handleClose={handleCloseTeamModal}
          open={teamModalOpen}
          player={player}
          title='Bytt lag'
        />
      )}
      <Menu
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
        anchorReference='anchorPosition'
        onClose={closeMenu}
        open={contextMenu !== null}>
        <MenuItem onClick={changePosition}>Bytt posisjon</MenuItem>
        <MenuItem onClick={changeTeam}>Bytt lag</MenuItem>
      </Menu>
    </>
  );
};

const PlayersList = ({ title, players }: PlayersListProps) => {
  return (
    <Stack gap={1} justifyContent='space-between' sx={{ flex: 1, borderRadius: 1, border: (theme) => `1px solid ${theme.palette.divider}`, p: 1 }}>
      <Stack gap={1}>
        <Typography variant='h3'>
          {title} ({players.length})
        </Typography>
        {players.map((player: Player) => (
          <Player key={player.id} player={player} />
        ))}
      </Stack>
    </Stack>
  );
};

export default PlayersList;
