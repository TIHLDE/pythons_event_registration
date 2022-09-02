// eslint-disable-no-explicit-any
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { fetcher } from 'utils';

import { IPlayer, ITeam } from 'types';

export type ChangeTeamModalProps = {
  player: IPlayer;
  open: boolean;
  handleClose: () => void;
  title: string;
};

export type FormDataProps = {
  team: ITeam['id'] | null;
};

const ChangeTeamModal = ({ open, handleClose, title, player }: ChangeTeamModalProps) => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormDataProps>({
    defaultValues: { team: player.teamId },
  });
  const onSubmit = (formData: FormDataProps) => {
    const data = { teamId: formData.team };
    axios.put(`/api/players/${player.id}`, { data: data }).then(() => {
      handleClose();
      router.replace(router.asPath);
    });
  };
  const { data: teams } = useSWR<ITeam[]>('/api/teams', fetcher);
  return (
    <Dialog onClose={handleClose} open={open} sx={{ '& .MuiDialog-paper': { width: 400, border: '2px solid #ffffff', p: 4 } }}>
      <Stack gap={2}>
        <Typography variant='h5'>{title}</Typography>
        <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Lag</InputLabel>
            <Controller
              control={control}
              name='team'
              render={({ field: { onChange, value } }) => (
                <Select label='Lag' onChange={onChange} value={value}>
                  {teams?.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <Stack direction='row' gap={1} justifyContent='space-between'>
            <Button color='error' onClick={handleClose}>
              Avbryt
            </Button>
            <Button color='success' type='submit' variant='contained'>
              Bytt lag
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default ChangeTeamModal;