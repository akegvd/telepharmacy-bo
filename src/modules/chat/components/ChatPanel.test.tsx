import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { sendChatMessage } from '@/shared/services/api/chat';

import { ChatPanel } from './ChatPanel';

jest.mock('@/shared/services/api/chat');

const mockSendChatMessage = sendChatMessage as jest.MockedFunction<typeof sendChatMessage>;

const renderChatPanel = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <ChatPanel />
    </QueryClientProvider>
  );
};

describe('ChatPanel', () => {
  beforeEach(() => {
    mockSendChatMessage.mockReset();
  });

  it('shows a hint before any message is sent', () => {
    renderChatPanel();

    expect(screen.getByText(/ask a question about the tasks/i)).toBeInTheDocument();
  });

  it('sends the typed message and renders the assistant reply', async () => {
    const user = userEvent.setup();
    mockSendChatMessage.mockResolvedValue({ answer: 'There are 3 pending tasks.' });

    renderChatPanel();

    await user.type(screen.getByPlaceholderText(/ask a question about your data/i), 'How many tasks are pending?');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByText('How many tasks are pending?')).toBeInTheDocument();
    expect(mockSendChatMessage).toHaveBeenCalledWith('How many tasks are pending?');

    await waitFor(() => expect(screen.getByText('There are 3 pending tasks.')).toBeInTheDocument());
  });

  it('clears the input after sending', async () => {
    const user = userEvent.setup();
    mockSendChatMessage.mockResolvedValue({ answer: 'ok' });

    renderChatPanel();

    const input = screen.getByPlaceholderText(/ask a question about your data/i);
    await user.type(input, 'hello');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(input).toHaveValue('');
  });

  it('does not send a blank message', async () => {
    const user = userEvent.setup();

    renderChatPanel();

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(mockSendChatMessage).not.toHaveBeenCalled();
  });

  it('shows an error alert when the request fails', async () => {
    const user = userEvent.setup();
    mockSendChatMessage.mockRejectedValue(new Error('network error'));

    renderChatPanel();

    await user.type(screen.getByPlaceholderText(/ask a question about your data/i), 'hi');
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());
  });
});
