import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { sendChatMessage } from '@/shared/services/api/chat';

import { useSendChatMessageMutation } from './useSendChatMessageMutation';

jest.mock('@/shared/services/api/chat');

const mockSendChatMessage = sendChatMessage as jest.MockedFunction<typeof sendChatMessage>;

interface IWrapperProps {
  children: ReactNode;
}

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: IWrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

describe('useSendChatMessageMutation', () => {
  beforeEach(() => {
    mockSendChatMessage.mockReset();
  });

  it('sends the message and resolves with the answer', async () => {
    mockSendChatMessage.mockResolvedValue({ answer: 'There are 3 pending tasks.' });

    const { result } = renderHook(() => useSendChatMessageMutation(), { wrapper: createWrapper() });

    result.current.mutate('How many tasks are pending?');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockSendChatMessage).toHaveBeenCalledWith('How many tasks are pending?');
    expect(result.current.data).toEqual({ answer: 'There are 3 pending tasks.' });
  });

  it('surfaces an error when the request fails', async () => {
    mockSendChatMessage.mockRejectedValue(new Error('network error'));

    const { result } = renderHook(() => useSendChatMessageMutation(), { wrapper: createWrapper() });

    result.current.mutate('hi');

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
