'use client';

import EditRounded from '@mui/icons-material/EditRounded';
import { Button, Dialog, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { Player, Team } from '@prisma/client';
import axios from 'axios';
import { format, parseJSON } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useModal } from 'hooks/useModal';
import { usePositions, useTeams } from 'hooks/useQuery';

export type EditPlayerModalProps = {
  player: Player;
};

type FormDataProps = {
  team: Team['id'] | '' | null;
  position: number;
};

const EditPlayerModal = ({ player }: EditPlayerModalProps) => {
  const { modalOpen, handleOpenModal, handleCloseModal } = useModal(false);
  const { data: teams = [] } = useTeams();
  const { data: positions = [] } = usePositions();
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormDataProps>({
    defaultValues: { team: player.teamId || '', position: player.positionId },
  });
  const onSubmit = useCallback(
    async (formData: FormDataProps) => {
      const data = { teamId: formData.team === '' ? null : formData.team, positionId: formData.position };
      await axios.put(`/api/players/${player.id}`, { data: data });
      handleCloseModal();
      router.refresh();
    },
    [handleCloseModal, player.id, router],
  );
  return (
    <>
      <IconButton onClick={handleOpenModal} size='small' sx={{ width: 24, height: 24 }}>
        <EditRounded />
      </IconButton>
      <Dialog onClose={handleCloseModal} open={modalOpen}>
        <Stack gap={2}>
          <Typography variant='h5'>Rediger spillerprofil</Typography>
          <Typography sx={{ whiteSpace: 'break-spaces' }}>{`Navn: ${player.name}
TIHLDE-id: ${player.tihlde_user_id}
Opprettet: ${format(parseJSON(player.createdAt), 'dd-MM-yyyy')}
`}</Typography>
          <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <InputLabel>Lag</InputLabel>
              <Controller
                control={control}
                name='team'
                render={({ field: { onChange, value } }) => (
                  <Select label='Lag' onChange={onChange} value={value}>
                    <MenuItem value=''>Ikke noe lag</MenuItem>
                    {teams.map((team) => (
                      <MenuItem key={team.id} value={team.id}>
                        {team.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Posisjon</InputLabel>
              <Controller
                control={control}
                name='position'
                render={({ field: { onChange, value } }) => (
                  <Select label='Posisjon' onChange={onChange} value={value}>
                    {positions.map((position) => (
                      <MenuItem key={position.id} value={position.id}>
                        {position.title}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <Stack direction='row' gap={1} justifyContent='space-between' sx={{ mt: 1 }}>
              <Button color='error' onClick={handleCloseModal} variant='text'>
                Avbryt
              </Button>
              <Button type='submit' variant='contained'>
                Lagre
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default EditPlayerModal;
