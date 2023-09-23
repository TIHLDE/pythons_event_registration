'use client';

import EditRounded from '@mui/icons-material/EditRounded';
import {
  Button,
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Player } from '@prisma/client';
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
  teamId: Player['teamId'] | '';
  positionId: Player['positionId'];
  disableRegistrations: Player['disableRegistrations'];
};

const EditPlayerModal = ({ player }: EditPlayerModalProps) => {
  const { modalOpen, handleOpenModal, handleCloseModal } = useModal(false);
  const { data: teams = [] } = useTeams();
  const { data: positions = [] } = usePositions();
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormDataProps>({
    defaultValues: { teamId: player.teamId || '', positionId: player.positionId, disableRegistrations: player.disableRegistrations },
  });
  const onSubmit = useCallback(
    async (formData: FormDataProps) => {
      const data: Pick<Player, 'teamId' | 'positionId' | 'disableRegistrations'> = { ...formData, teamId: formData.teamId === '' ? null : formData.teamId };
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
          <Stack component='form' gap={2} onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth>
              <InputLabel>Lag</InputLabel>
              <Controller
                control={control}
                name='teamId'
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
                name='positionId'
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
            <FormGroup>
              <FormControlLabel
                control={
                  <Controller
                    control={control}
                    name='disableRegistrations'
                    render={({ field: { onChange, value } }) => <Checkbox checked={value} onChange={onChange} />}
                  />
                }
                label='Deaktiver påmelding'
              />
              <FormHelperText>
                {`Ved å deaktivere påmelding til arrangementer vil spilleren heller ikke motta bøter for manglende påmelding. Spilleren vil fremdeles kunne melde
                seg på sosiale arrangementer, men vil ikke vises i listen over "Ikke svart" før den eventuelt har meldt seg på/av. Passende for spillere som midlertidig
                ikke trener og spiller kamper, for eksempel på grunn av langtidsskade eller utveksling. Om spilleren allerede har meldt seg på fremtidige arrangementer
                vil den fremdeles kunne endre påmelding på disse etter at "Deaktiver påmelding" skrus på.`}
              </FormHelperText>
            </FormGroup>
            <Stack direction='row' gap={1} justifyContent='space-between'>
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
