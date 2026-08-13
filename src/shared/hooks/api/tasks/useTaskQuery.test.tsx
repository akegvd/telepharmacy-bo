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
import { useTaskQuery } from './useTaskQuery';

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

describe('useTaskQuery', () => {
  beforeEach(() => {
    mockFetchTaskList.mockReset();
    mockFetchTask.mockReset();
    mockUpdateTaskStatus.mockReset();
  });

  it("fetches a single task by id when it isn't already cached", async () => {
    mockFetchTask.mockResolvedValue(makeRawTask({ id: '1' }));

    const { result } = renderHook(() => useTaskQuery('1'), { wrapper: createWrapper(newClient()) });

    await waitFor(() => expect(result.current.data).toEqual(makeTask({ id: '1' })));
    expect(mockFetchTask).toHaveBeenCalledWith('1');
  });

  it('uses the matching task from the list cache as initial data, so it renders without waiting on the network', () => {
    const cachedTask = makeTask({ id: '1', customerName: 'Cached Name' });
    mockFetchTask.mockReturnValue(new Promise(() => {})); // never resolves

    const queryClient = newClient();
    const taskList = [cachedTask];
    queryClient.setQueryData(taskKeys.all, { taskList, summary: buildTaskListSummary(taskList) });

    const { result } = renderHook(() => useTaskQuery('1'), { wrapper: createWrapper(queryClient) });

    expect(result.current.data).toEqual(cachedTask);
    expect(result.current.isLoading).toBe(false);
  });
});
