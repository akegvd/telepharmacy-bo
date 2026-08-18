'use client';

import { OptionsObject, useSnackbar, VariantType } from 'notistack';

export interface IShowToastOptions extends Omit<OptionsObject, 'variant'> {
  variant?: VariantType;
}

export const useToast = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showToast = (message: string, options?: IShowToastOptions) => enqueueSnackbar(message, options);

  return { showToast, closeToast: closeSnackbar };
};
