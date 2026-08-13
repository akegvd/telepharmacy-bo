import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import { fetchTask, fetchTasks, updateTaskStatus } from '@/shared/services/api/tasks';

import { makeTask } from '../mocks/taskFixtures';

jest.mock('@/shared/services/api/tasks');

const mockFetchTasks = fetchTasks as jest.MockedFunction<typeof fetchTasks>;
const mockFetchTask = fetchTask as jest.MockedFunction<typeof fetchTask>;
const mockUpdateTaskStatus = updateTaskStatus as jest.MockedFunction<typeof updateTaskStatus>;

import { taskKeys, useTaskQuery, useTasksQuery, useUpdateTaskStatusMutation } from './useTaskQueries';

function makeRawTask(overrides: Record<string, unknown> = {}) {
  return {
    id: '1',
    customerName: 'Somchai P.',
    serviceType: 'video_call',
    symptom: 'Persistent dry cough',
    status: 'new',
    createdAt: '2026-08-09T09:12:00.000Z',
    ...overrides,
  };
}

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function newClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

describe('useTasksQuery', () => {
  beforeEach(() => {
    mockFetchTasks.mockReset();
    mockFetchTask.mockReset();
    mockUpdateTaskStatus.mockReset();
  });

  it('fetches and returns the task list', async () => {
    mockFetchTasks.mockResolvedValue([makeRawTask({ id: '1' })]);

    const { result } = renderHook(() => useTasksQuery(), { wrapper: createWrapper(newClient()) });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ tasks: [makeTask({ id: '1' })], duplicateIds: [] });
    expect(mockFetchTasks).toHaveBeenCalledTimes(1);
  });
});

describe('useTaskQuery', () => {
  beforeEach(() => {
    mockFetchTasks.mockReset();
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
    queryClient.setQueryData(taskKeys.all, { tasks: [cachedTask], duplicateIds: [] });

    const { result } = renderHook(() => useTaskQuery('1'), { wrapper: createWrapper(queryClient) });

    expect(result.current.data).toEqual(cachedTask);
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useUpdateTaskStatusMutation', () => {
  beforeEach(() => {
    mockFetchTasks.mockReset();
    mockFetchTask.mockReset();
    mockUpdateTaskStatus.mockReset();
  });

  it('writes the updated task into both the detail cache and the list cache', async () => {
    const original = makeTask({ id: '1', status: 'new' });
    const updated = makeTask({ id: '1', status: 'in_progress' });
    mockUpdateTaskStatus.mockResolvedValue(makeRawTask({ id: '1', status: 'in_progress' }));

    const queryClient = newClient();
    queryClient.setQueryData(taskKeys.detail('1'), original);
    queryClient.setQueryData(taskKeys.all, { tasks: [original], duplicateIds: [] });

    const { result } = renderHook(() => useUpdateTaskStatusMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ id: '1', status: 'in_progress' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockUpdateTaskStatus).toHaveBeenCalledWith('1', 'in_progress', undefined);
    expect(queryClient.getQueryData(taskKeys.detail('1'))).toEqual(updated);
    expect(queryClient.getQueryData(taskKeys.all)).toEqual({ tasks: [updated], duplicateIds: [] });
  });

  it('leaves the caches untouched when the update fails', async () => {
    const original = makeTask({ id: '1', status: 'new' });
    mockUpdateTaskStatus.mockRejectedValue(new Error('network error'));

    const queryClient = newClient();
    queryClient.setQueryData(taskKeys.detail('1'), original);

    const { result } = renderHook(() => useUpdateTaskStatusMutation(), {
      wrapper: createWrapper(queryClient),
    });

    result.current.mutate({ id: '1', status: 'in_progress' });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(queryClient.getQueryData(taskKeys.detail('1'))).toEqual(original);
  });
});
