import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { makeTask } from '@/modules/dashboard/mocks/taskFixtures';
import { buildTaskListSummary } from '@/modules/dashboard/utils/transforms/transformTaskListResponse';
import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { fetchTask, fetchTaskList, updateTaskStatus } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { taskKeys } from './taskKeys';
import { useUpdateTaskStatusMutation } from './useUpdateTaskStatusMutation';

jest.mock('@/shared/services/api/tasks');

const mockFetchTaskList = fetchTaskList as jest.MockedFunction<typeof fetchTaskList>;
const mockFetchTask = fetchTask as jest.MockedFunction<typeof fetchTask>;
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

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: { children: ReactNode }) => {
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
    mockFetchTask.mockReset();
    mockUpdateTaskStatus.mockReset();
  });

  it('writes the updated task into both the detail cache and the list cache', async () => {
    const original = makeTask({ id: '1', status: TASK_STATUS.NEW });
    const updated = makeTask({ id: '1', status: TASK_STATUS.IN_PROGRESS });
    mockUpdateTaskStatus.mockResolvedValue(makeRawTask({ id: '1', status: TASK_STATUS.IN_PROGRESS }));

    const queryClient = newClient();
    const originalList = [original];
    queryClient.setQueryData(taskKeys.detail('1'), original);
    queryClient.setQueryData(taskKeys.all, {
      taskList: originalList,
      summary: buildTaskListSummary(originalList),
    });

    const { result } = renderHook(() => useUpdateTaskStatusMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ id: '1', status: TASK_STATUS.IN_PROGRESS });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const updatedList = [updated];
    expect(mockUpdateTaskStatus).toHaveBeenCalledWith('1', 'in_progress', undefined);
    expect(queryClient.getQueryData(taskKeys.detail('1'))).toEqual(updated);
    expect(queryClient.getQueryData(taskKeys.all)).toEqual({
      taskList: updatedList,
      summary: buildTaskListSummary(updatedList),
    });
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
    queryClient.setQueryData(taskKeys.all, originalListCache);

    const { result } = renderHook(() => useUpdateTaskStatusMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ id: '1', status: TASK_STATUS.IN_PROGRESS });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(queryClient.getQueryData(taskKeys.detail('1'))).toEqual(original);
    expect(queryClient.getQueryData(taskKeys.all)).toEqual(originalListCache);
  });
});
