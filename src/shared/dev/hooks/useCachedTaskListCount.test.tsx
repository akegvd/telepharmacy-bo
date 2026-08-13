import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';

import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';

import { useCachedTaskListCount } from './useCachedTaskListCount';

interface IWrapperProps {
  children: ReactNode;
}

const makeListCache = (taskCount: number) => {
  return { taskList: Array.from({ length: taskCount }, (_, index) => ({ id: String(index + 1) })) };
};

const createWrapper = (queryClient: QueryClient) => {
  const Wrapper = ({ children }: IWrapperProps) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  return Wrapper;
};

describe('useCachedTaskListCount', () => {
  it('returns null while no task list has been cached', () => {
    const queryClient = new QueryClient();

    const { result } = renderHook(() => useCachedTaskListCount(), { wrapper: createWrapper(queryClient) });

    expect(result.current).toBeNull();
  });

  it('reports the number of tasks in the cached list', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(taskKeys.list(), makeListCache(2));

    const { result } = renderHook(() => useCachedTaskListCount(), { wrapper: createWrapper(queryClient) });

    expect(result.current).toBe(2);
  });

  it('follows the cache as it changes', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(taskKeys.list(), makeListCache(1));

    const { result } = renderHook(() => useCachedTaskListCount(), { wrapper: createWrapper(queryClient) });
    expect(result.current).toBe(1);

    act(() => {
      queryClient.setQueryData(taskKeys.list(), makeListCache(2));
    });

    expect(result.current).toBe(2);
  });

  it('prefers the list query that was updated most recently', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(taskKeys.list(), makeListCache(1));

    const { result } = renderHook(() => useCachedTaskListCount(), { wrapper: createWrapper(queryClient) });

    act(() => {
      queryClient.setQueryData(taskKeys.list({ customerName_like: 'a' }), makeListCache(3));
    });

    expect(result.current).toBe(3);
  });

  it('ignores cached task queries that are not lists', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(taskKeys.detail('1'), { id: '1' });

    const { result } = renderHook(() => useCachedTaskListCount(), { wrapper: createWrapper(queryClient) });

    expect(result.current).toBeNull();
  });
});
