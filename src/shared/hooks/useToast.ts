'use client';

import { OptionsObject, useSnackbar, VariantType } from 'notistack';
import { useCallback } from 'react';

export interface IShowToastOptions extends Omit<OptionsObject, 'variant'> {
  variant?: VariantType;
}

export const useToast = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showToast = useCallback(
    (message: string, options?: IShowToastOptions) => enqueueSnackbar(message, options),
    [enqueueSnackbar]
  );

  return { showToast, closeToast: closeSnackbar };
};
