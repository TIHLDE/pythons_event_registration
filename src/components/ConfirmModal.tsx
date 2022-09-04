// eslint-disable-no-explicit-any
import { Dialog } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export type EventModalProps = {
  title: string;
  description?: string;
  onConfirm: () => void;
} & ButtonProps;

const ConfirmModal = ({ title, description = 'Er du helt sikker?', onConfirm, children, ...props }: EventModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button {...props} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Dialog onClose={() => setOpen(false)} open={open} sx={{ '& .MuiDialog-paper': { maxWidth: 400, width: '100%', border: '2px solid #ffffff', p: 2 } }}>
        <Stack gap={2}>
          <Typography variant='h2'>{title}</Typography>
          <Typography variant='body1'>{description}</Typography>
          <Stack direction='row' justifyContent='space-between' spacing={1}>
            <Button color='error' onClick={() => setOpen(false)}>
              Nei, avbryt
            </Button>
            <Button
              color='success'
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
              variant='contained'>
              Jeg er sikker
            </Button>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
};

export default ConfirmModal;
