import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type ReactElement } from 'react';

/**
 * Seeds a fresh TanStack Query cache for a story instead of hitting the real
 * API — Storybook has no mock server running, so an unseeded query would
 * just hang/error against a nonexistent backend.
 */
export const withQueryClient = (seed: (queryClient: QueryClient) => void) => {
  const QueryClientDecorator = (Story: () => ReactElement) => {
    const [queryClient] = useState(() => {
      const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
      seed(client);
      return client;
    });

    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  };

  return QueryClientDecorator;
};
