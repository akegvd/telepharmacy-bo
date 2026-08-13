import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { makeTask } from '@/modules/dashboard/mocks/taskFixtures';
import { buildTaskListSummary } from '@/modules/dashboard/utils/transforms/transformTaskListResponse';
import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';
import { fetchTaskList, updateTaskStatus } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { useTaskListQuery } from './useTaskListQuery';
import { useUpdateTaskStatusMutation } from './useUpdateTaskStatusMutation';

jest.mock('@/shared/services/api/tasks');

const mockFetchTaskList = fetchTaskList as jest.MockedFunction<typeof fetchTaskList>;
const mockUpdateTaskStatus = updateTaskStatus as jest.MockedFunction<typeof updateTaskStatus>;

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

interface IWrapperProps {
  children: ReactNode;
}

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: IWrapperProps) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  return Wrapper;
};

const newClient = () => {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
};

describe('useUpdateTaskStatusMutation', () => {
  beforeEach(() => {
    mockFetchTaskList.mockReset();
    mockUpdateTaskStatus.mockReset();
  });

  it('writes the updated task into the detail cache', async () => {
    const original = makeTask({ id: '1', status: TASK_STATUS.NEW });
    const updated = makeTask({ id: '1', status: TASK_STATUS.IN_PROGRESS });
    mockUpdateTaskStatus.mockResolvedValue(makeRawTask({ id: '1', status: TASK_STATUS.IN_PROGRESS }));

    const queryClient = newClient();
    queryClient.setQueryData(taskKeys.detail('1'), original);

    const { result } = renderHook(() => useUpdateTaskStatusMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ id: '1', status: TASK_STATUS.IN_PROGRESS });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockUpdateTaskStatus).toHaveBeenCalledWith('1', 'in_progress', undefined);
    expect(queryClient.getQueryData(taskKeys.detail('1'))).toEqual(updated);
  });

  it('refetches the task list from the API after a successful status update', async () => {
    mockFetchTaskList.mockResolvedValue([makeRawTask({ id: '1', status: TASK_STATUS.NEW })]);
    mockUpdateTaskStatus.mockResolvedValue(makeRawTask({ id: '1', status: TASK_STATUS.IN_PROGRESS }));

    const queryClient = newClient();
    const wrapper = createWrapper(queryClient);

    const { result: listResult } = renderHook(() => useTaskListQuery(), { wrapper });
    await waitFor(() => expect(listResult.current.isSuccess).toBe(true));
    expect(mockFetchTaskList).toHaveBeenCalledTimes(1);

    const { result: mutationResult } = renderHook(() => useUpdateTaskStatusMutation(), { wrapper });
    mutationResult.current.mutate({ id: '1', status: TASK_STATUS.IN_PROGRESS });

    await waitFor(() => expect(mutationResult.current.isSuccess).toBe(true));
    await waitFor(() => expect(mockFetchTaskList).toHaveBeenCalledTimes(2));
  });

  it('leaves the caches untouched when the update fails', async () => {
    const original = makeTask({ id: '1', status: TASK_STATUS.NEW });
    mockUpdateTaskStatus.mockRejectedValue(new Error('network error'));

    const queryClient = newClient();
    const originalList = [original];
    const originalListCache = {
      taskList: originalList,
      summary: buildTaskListSummary(originalList),
    };
    queryClient.setQueryData(taskKeys.detail('1'), original);
    queryClient.setQueryData(taskKeys.list(), originalListCache);

    const { result } = renderHook(() => useUpdateTaskStatusMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ id: '1', status: TASK_STATUS.IN_PROGRESS });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(queryClient.getQueryData(taskKeys.detail('1'))).toEqual(original);
    expect(queryClient.getQueryData(taskKeys.list())).toEqual(originalListCache);
  });
});
