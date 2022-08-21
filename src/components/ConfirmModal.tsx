// eslint-disable-no-explicit-any
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
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
    <Modal onClose={handleClose} open={open}>
      <Stack
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '1px solid white',
          p: 2,
          borderRadius: 1,
        }}>
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
      </Stack>
    </Modal>
  );
};

export default ConfirmModal;
