'use client';

import { SnackbarProvider as NotistackSnackbarProvider } from 'notistack';
import { ReactNode } from 'react';

import { SNACKBAR_ANCHOR_ORIGIN, SNACKBAR_AUTO_HIDE_DURATION, SNACKBAR_MAX_SNACK } from '@/shared/constants/snackbar';

import Toast from './Toast';

interface ISnackbarProviderProps {
  children: ReactNode;
}

const SnackbarProvider = ({ children }: ISnackbarProviderProps) => {
  return (
    <NotistackSnackbarProvider
      maxSnack={SNACKBAR_MAX_SNACK}
      anchorOrigin={SNACKBAR_ANCHOR_ORIGIN}
      autoHideDuration={SNACKBAR_AUTO_HIDE_DURATION}
      Components={{
        default: Toast,
        success: Toast,
        error: Toast,
        warning: Toast,
        info: Toast,
      }}
    >
      {children}
    </NotistackSnackbarProvider>
  );
};

export default SnackbarProvider;
