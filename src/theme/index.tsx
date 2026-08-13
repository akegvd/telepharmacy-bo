'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { theme } from './theme';

interface IAppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider = ({ children }: IAppThemeProviderProps) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
