import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';

import { SnackbarProvider } from '@/shared/components/SnackbarProvider';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { updateTaskStatus } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { makeTask } from '../mocks/taskFixtures';

import { useAdvanceTaskStatus } from './useAdvanceTaskStatus';

jest.mock('@/shared/services/api/tasks');

const mockUpdateTaskStatus = updateTaskStatus as jest.MockedFunction<typeof updateTaskStatus>;

const makeRawTask = (overrides: Partial<ITaskItemResponse> = {}): ITaskItemResponse => ({
  id: '42',
  customerName: 'Somchai P.',
  status: TASK_STATUS.IN_PROGRESS,
  createdAt: '2026-08-09T09:12:00.000Z',
  ...overrides,
});

interface IWrapperProps {
  children: ReactNode;
}

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }: IWrapperProps) => (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </QueryClientProvider>
  );

  return Wrapper;
};

describe('useAdvanceTaskStatus', () => {
  beforeEach(() => {
    mockUpdateTaskStatus.mockReset();
  });

  it('starts with the confirmation closed', () => {
    const { result } = renderHook(() => useAdvanceTaskStatus(makeTask({ status: TASK_STATUS.NEW })), {
      wrapper: createWrapper(),
    });

    expect(result.current.isConfirmingAdvance).toBe(false);
    expect(result.current.nextStatus).toBe(TASK_STATUS.IN_PROGRESS);
  });

  it('opens and closes the confirmation without calling the API', () => {
    const { result } = renderHook(() => useAdvanceTaskStatus(makeTask({ status: TASK_STATUS.NEW })), {
      wrapper: createWrapper(),
    });

    act(() => result.current.handleAdvanceClick());
    expect(result.current.isConfirmingAdvance).toBe(true);

    act(() => result.current.handleCancelAdvance());
    expect(result.current.isConfirmingAdvance).toBe(false);
    expect(mockUpdateTaskStatus).not.toHaveBeenCalled();
  });

  it('advances the task status and closes the confirmation on success', async () => {
    mockUpdateTaskStatus.mockResolvedValue(makeRawTask({ status: TASK_STATUS.IN_PROGRESS }));
    const { result } = renderHook(
      () => useAdvanceTaskStatus(makeTask({ id: '42', status: TASK_STATUS.NEW })),
      { wrapper: createWrapper() }
    );

    act(() => result.current.handleAdvanceClick());
    act(() => result.current.handleConfirmAdvance());

    await waitFor(() => expect(result.current.isConfirmingAdvance).toBe(false));
    expect(mockUpdateTaskStatus).toHaveBeenCalledWith('42', TASK_STATUS.IN_PROGRESS, undefined);
  });

  it('closes the confirmation when the update fails', async () => {
    mockUpdateTaskStatus.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(
      () => useAdvanceTaskStatus(makeTask({ id: '42', status: TASK_STATUS.NEW })),
      { wrapper: createWrapper() }
    );

    act(() => result.current.handleAdvanceClick());
    act(() => result.current.handleConfirmAdvance());

    await waitFor(() => expect(result.current.isConfirmingAdvance).toBe(false));
  });

  it('does nothing when confirming with no next status', () => {
    const { result } = renderHook(() => useAdvanceTaskStatus(makeTask({ status: TASK_STATUS.COMPLETED })), {
      wrapper: createWrapper(),
    });

    act(() => result.current.handleConfirmAdvance());

    expect(mockUpdateTaskStatus).not.toHaveBeenCalled();
  });
});
