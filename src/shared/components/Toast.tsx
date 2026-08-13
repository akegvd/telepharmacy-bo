'use client';

import { Alert, AlertProps } from '@mui/material';
import { CustomContentProps, useSnackbar, VariantType } from 'notistack';
import { forwardRef } from 'react';

const mapVariantToAlertSeverity: Partial<Record<VariantType, AlertProps['severity']>> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
};

export const Toast = forwardRef<HTMLDivElement, CustomContentProps>(
  ({ id, message, variant, style, className }, ref) => {
    const { closeSnackbar } = useSnackbar();

    return (
      <Alert
        ref={ref}
        style={style}
        className={className}
        onClose={() => closeSnackbar(id)}
        severity={mapVariantToAlertSeverity[variant] ?? 'info'}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    );
  }
);

Toast.displayName = 'Toast';
