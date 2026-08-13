import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';

import { SnackbarProvider } from '@/shared/components/SnackbarProvider';
import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';
import { createRandomTask, fetchTaskList, resetTaskList } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { useDevTaskApiControls } from './useDevTaskApiControls';

jest.mock('@/shared/services/api/tasks');

const mockCreateRandomTask = createRandomTask as jest.MockedFunction<typeof createRandomTask>;
const mockResetTaskList = resetTaskList as jest.MockedFunction<typeof resetTaskList>;
const mockFetchTaskList = fetchTaskList as jest.MockedFunction<typeof fetchTaskList>;

const makeRawTask = (overrides: Partial<ITaskItemResponse> = {}): ITaskItemResponse => {
  return {
    id: '1',
    customerName: 'Somchai P.',
    serviceType: SERVICE_TYPE.VIDEO_CALL,
    symptom: 'Persistent dry cough',
    status: TASK_STATUS.NEW,
    createdAt: '2026-08-09T09:12:00.000Z',
    ...overrides,
  };
};

/** Stands in for whatever list query a page has mounted, so we can watch whether it refetches. */
const useTaskListSpyQuery = () => {
  return useQuery({ queryKey: taskKeys.list(), queryFn: () => fetchTaskList() });
};

interface IWrapperProps {
  children: ReactNode;
}

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: IWrapperProps) => {
    return (
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </QueryClientProvider>
    );
  };

  return Wrapper;
};

const newClient = () => {
  return new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
};

const flushPendingWork = async () => {
  await act(async () => {
    await Promise.resolve();
  });
};

describe('useDevTaskApiControls', () => {
  beforeEach(() => {
    mockCreateRandomTask.mockReset();
    mockResetTaskList.mockReset();
    mockFetchTaskList.mockReset();
  });

  it('adds a random task without refetching the list, leaving that to auto-refresh', async () => {
    mockFetchTaskList.mockResolvedValue([makeRawTask()]);
    mockCreateRandomTask.mockResolvedValue(makeRawTask({ id: '21' }));

    const wrapper = createWrapper(newClient());

    const { result: listResult } = renderHook(() => useTaskListSpyQuery(), { wrapper });
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true));
    expect(mockFetchTaskList).toHaveBeenCalledTimes(1);

    const { result } = renderHook(() => useDevTaskApiControls(), { wrapper });
    result.current.addRandomTaskMutation.mutate();

    await waitFor(() => expect(result.current.addRandomTaskMutation.isSuccess).toBe(true));
    await flushPendingWork();

    expect(mockCreateRandomTask).toHaveBeenCalledTimes(1);
    expect(mockFetchTaskList).toHaveBeenCalledTimes(1);
  });

  it('resets the list without refetching it, leaving that to auto-refresh', async () => {
    mockFetchTaskList.mockResolvedValue([makeRawTask()]);
    mockResetTaskList.mockResolvedValue([makeRawTask()]);

    const wrapper = createWrapper(newClient());

    const { result: listResult } = renderHook(() => useTaskListSpyQuery(), { wrapper });
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true));

    const { result } = renderHook(() => useDevTaskApiControls(), { wrapper });
    result.current.resetTaskListMutation.mutate();

    await waitFor(() => expect(result.current.resetTaskListMutation.isSuccess).toBe(true));
    await flushPendingWork();

    expect(mockResetTaskList).toHaveBeenCalledTimes(1);
    expect(mockFetchTaskList).toHaveBeenCalledTimes(1);
  });

  it('surfaces a failed action', async () => {
    mockFetchTaskList.mockResolvedValue([makeRawTask()]);
    mockCreateRandomTask.mockRejectedValue(new Error('Could not reach the API.'));

    const wrapper = createWrapper(newClient());

    const { result: listResult } = renderHook(() => useTaskListSpyQuery(), { wrapper });
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true));

    const { result } = renderHook(() => useDevTaskApiControls(), { wrapper });
    result.current.addRandomTaskMutation.mutate();

    await waitFor(() => expect(result.current.addRandomTaskMutation.isError).toBe(true));
    expect(mockFetchTaskList).toHaveBeenCalledTimes(1);
  });
});
