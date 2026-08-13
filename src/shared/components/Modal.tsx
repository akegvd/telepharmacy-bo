'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, IconButton, styled } from '@mui/material';

interface IModalProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  onExited?: () => void;
}

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

export const Modal = ({ children, open, onClose, onExited }: IModalProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ transition: { onExited } }}>
      <CloseButton aria-label="Close" onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      <DialogContent sx={{ pt: 5, pr: 6 }}>{children}</DialogContent>
    </Dialog>
  );
};
