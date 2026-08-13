import { useQueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import AppQueryClientProvider from './AppQueryClientProvider';

const Probe = () => {
  const queryClient = useQueryClient();
  return <p>{queryClient ? 'has client' : 'no client'}</p>;
};

describe('AppQueryClientProvider', () => {
  it('provides a QueryClient to descendants', () => {
    render(
      <AppQueryClientProvider>
        <Probe />
      </AppQueryClientProvider>
    );

    expect(screen.getByText('has client')).toBeInTheDocument();
  });
});
