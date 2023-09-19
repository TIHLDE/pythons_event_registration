'use client';

// eslint-disable-no-explicit-any
import { Button, ButtonProps, Dialog, Stack, Typography } from '@mui/material';
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
      <Dialog onClose={() => setOpen(false)} open={open}>
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
