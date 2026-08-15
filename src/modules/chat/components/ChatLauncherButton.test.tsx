import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ChatLauncherButton } from './ChatLauncherButton';

const renderChatLauncherButton = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <ChatLauncherButton />
    </QueryClientProvider>
  );
};

describe('ChatLauncherButton', () => {
  it('does not show the chat panel until opened', () => {
    renderChatLauncherButton();

    expect(screen.queryByText('Ask about your data')).not.toBeInTheDocument();
  });

  it('opens the chat panel when clicked', async () => {
    const user = userEvent.setup();
    renderChatLauncherButton();

    await user.click(screen.getByRole('button', { name: /ask ai about your data/i }));

    expect(screen.getByText('Ask about your data')).toBeInTheDocument();
  });

  it('closes the chat panel via the modal close button', async () => {
    const user = userEvent.setup();
    renderChatLauncherButton();

    await user.click(screen.getByRole('button', { name: /ask ai about your data/i }));
    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(screen.queryByText('Ask about your data')).not.toBeInTheDocument();
  });
});
