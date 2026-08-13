'use client';

import AppQueryClientProvider from '@/shared/components/AppQueryClientProvider';
import SnackbarProvider from '@/shared/components/SnackbarProvider';
import LoadingProvider from '@/shared/contexts/LoadingContext';
import AppThemeProvider from '@/theme';

interface IProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: IProvidersProps) => {
  return (
    <AppQueryClientProvider>
      <AppThemeProvider>
        <LoadingProvider>
          <SnackbarProvider>{children}</SnackbarProvider>
        </LoadingProvider>
      </AppThemeProvider>
    </AppQueryClientProvider>
  );
};

export default Providers;
