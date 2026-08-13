'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { LoadingProvider } from '@/shared/contexts/LoadingContext';
import { AppThemeProvider } from '@/theme';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { retry: 1, staleTime: 5_000 } },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <LoadingProvider>{children}</LoadingProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}
