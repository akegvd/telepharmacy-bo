'use client';

import AppQueryClientProvider from '@/shared/components/AppQueryClientProvider';
import { LoadingProvider } from '@/shared/contexts/LoadingContext';
import { AppThemeProvider } from '@/theme';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppQueryClientProvider>
      <AppThemeProvider>
        <LoadingProvider>{children}</LoadingProvider>
      </AppThemeProvider>
    </AppQueryClientProvider>
  );
};

export default Providers;
