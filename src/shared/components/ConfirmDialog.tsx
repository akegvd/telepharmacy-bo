'use client';

import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';

export interface IConfirmDialogProps {
  open: boolean;
  title: string;
  description?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  icon?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  onExited?: () => void;
}

const DefaultConfirmIcon = styled(ErrorOutlineOutlinedIcon)({
  fontSize: 80,
  width: 80,
  height: 80,
});

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    minWidth: 460,
  },
}));

const Body = styled(Box)({
  textAlign: 'center',
});

const ActionsRow = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

const DEFAULT_ICON = <DefaultConfirmIcon color="error" />;

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  loading,
  icon = DEFAULT_ICON,
  onConfirm,
  onCancel,
  onExited,
}: IConfirmDialogProps) => {
  const handleClose: NonNullable<DialogProps['onClose']> = (_event, reason) => {
    if (reason === 'backdropClick') {
      return;
    }

    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby={description ? 'confirm-dialog-description' : undefined}
      slotProps={{ transition: { onExited } }}
    >
      <StyledDialogContent>
        <Body sx={{ pt: 2 }}>
          {icon}
          <Typography id="confirm-dialog-title" variant="h6" color="text.primary" sx={{ mt: 1 }}>
            {title}
          </Typography>
          {description && typeof description === 'string' ? (
            <Typography id="confirm-dialog-description" variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {description}
            </Typography>
          ) : (
            description
          )}
        </Body>
      </StyledDialogContent>
      <DialogActions sx={{ pb: 3 }}>
        <ActionsRow>
          <Stack spacing={3} direction="row">
            <Button variant="outlined" color="primary" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant="contained" color="primary" loading={loading} onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </Stack>
        </ActionsRow>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
