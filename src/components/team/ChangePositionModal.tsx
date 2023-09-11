'use client';

// eslint-disable-no-explicit-any
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Player, Position } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import useSWR from 'swr';
import { fetcher } from 'utils';

export type ChangePositionModalProps = {
  player: Pick<Player, 'id' | 'positionId'>;
  open: boolean;
  handleClose: () => void;
  title: string;
  description: string;
};

export type FormDataProps = {
  position: number;
};

const ChangePositionModal = ({ open, handleClose, title, description, player }: ChangePositionModalProps) => {
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: { position: player.positionId },
  });

  const onSubmit = async (formData: FormDataProps) => {
    const data = { positionId: formData.position };
    await axios.put(`/api/players/${player.id}`, { data: data });
    handleClose();
    router.refresh();
  };

  const { data: positions } = useSWR('/api/positions', fetcher);
  return (
    <Dialog onClose={handleClose} open={open}>
      <Stack gap={2}>
        <Typography variant='h5'>{title}</Typography>
        <Typography variant='body1'>{description}</Typography>
        <Stack component='form' gap={1} onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Posisjon</InputLabel>
            <Controller
              control={control}
              name='position'
              render={({ field: { onChange, value } }) => (
                <Select label='Posisjon' onChange={onChange} value={value}>
                  {positions?.map((position: Position) => (
                    <MenuItem key={position.id} value={position.id}>
                      {position.title}
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
              Bytt posisjon
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default ChangePositionModal;