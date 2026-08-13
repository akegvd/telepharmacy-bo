import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';

import { makeTask } from '@/modules/dashboard/mocks/taskFixtures';
import { buildTaskListSummary } from '@/modules/dashboard/utils/transforms/transformTaskListResponse';
import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { fetchTaskList, updateTaskStatus } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { ALL } from '../constants/filters';

import { useTaskListQuery } from './useTaskListQuery';

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

describe('useTaskListQuery', () => {
  beforeEach(() => {
    mockFetchTaskList.mockReset();
    mockUpdateTaskStatus.mockReset();
  });

  it('fetches and returns the task list', async () => {
    mockFetchTaskList.mockResolvedValue([makeRawTask({ id: '1' })]);

    const { result } = renderHook(() => useTaskListQuery(), { wrapper: createWrapper(newClient()) });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const taskList = [makeTask({ id: '1' })];
    expect(result.current.data).toEqual({ taskList, summary: buildTaskListSummary(taskList) });
    expect(mockFetchTaskList).toHaveBeenCalledTimes(1);
    expect(mockFetchTaskList).toHaveBeenCalledWith({});
  });

  it('forwards filters to the API as json-server style query params', async () => {
    mockFetchTaskList.mockResolvedValue([makeRawTask({ id: '1' })]);

    const { result } = renderHook(
      () =>
        useTaskListQuery({
          filters: {
            customerName: 'Somchai',
            serviceType: SERVICE_TYPE.CHAT,
            status: TASK_STATUS.NEW,
            createdFrom: '',
            createdTo: '',
          },
        }),
      { wrapper: createWrapper(newClient()) }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchTaskList).toHaveBeenCalledWith({
      customerName_like: 'Somchai',
      serviceType: SERVICE_TYPE.CHAT,
      status: TASK_STATUS.NEW,
    });
  });

  it('forwards the created date range as a full-day ISO range', async () => {
    mockFetchTaskList.mockResolvedValue([makeRawTask({ id: '1' })]);

    const { result } = renderHook(
      () =>
        useTaskListQuery({
          filters: {
            customerName: '',
            serviceType: ALL,
            status: ALL,
            createdFrom: '2026-08-01',
            createdTo: '2026-08-15',
          },
        }),
      { wrapper: createWrapper(newClient()) }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockFetchTaskList).toHaveBeenCalledWith({
      createdAt_gte: dayjs('2026-08-01').startOf('day').toISOString(),
      createdAt_lte: dayjs('2026-08-15').endOf('day').toISOString(),
    });
  });
});
