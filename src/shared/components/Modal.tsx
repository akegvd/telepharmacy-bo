'use client';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, IconButton } from '@mui/material';

export const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <IconButton aria-label="Close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 5 }}>{children}</DialogContent>
    </Dialog>
  );
};
