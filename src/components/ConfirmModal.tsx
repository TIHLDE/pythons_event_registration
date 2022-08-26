// eslint-disable-no-explicit-any
import { Dialog } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export type EventModalProps = {
  open: boolean;
  handleClose: () => void;
  title: string;
  onConfirm: () => void;
};

const ConfirmModal = ({ open, handleClose, title, onConfirm }: EventModalProps) => {
  return (
    <Dialog onClose={handleClose} open={open} sx={{ '& .MuiDialog-paper': { width: 400, border: '2px solid #ffffff', p: 4 } }}>
      <Stack gap={2}>
        <Typography variant='h2'>{title}</Typography>
        <Typography variant='body1'>Er du sikker på at du vil slette arrangementet?</Typography>
        <Stack direction='row' justifyContent='space-between' spacing={1}>
          <Button color='error' onClick={handleClose}>
            Nei
          </Button>
          <Button color='success' onClick={onConfirm} variant='contained'>
            Ja
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default ConfirmModal;
