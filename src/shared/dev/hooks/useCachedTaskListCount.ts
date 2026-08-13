'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useSyncExternalStore } from 'react';

import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';

/** Structural view of the cached list — the dev panel only ever counts it, so the domain shape stays in its module. */
interface ICachedTaskList {
  taskList: unknown[];
}

const hasTaskList = (data: unknown): data is ICachedTaskList => {
  return !!data && Array.isArray((data as ICachedTaskList).taskList);
};

/**
 * Reports how many tasks the most recently loaded list query holds, read straight from the
 * TanStack cache so the dev panel mirrors whatever the page already fetched instead of
 * issuing a request of its own. Returns null while no list has loaded yet.
 */
export const useCachedTaskListCount = (): number | null => {
  const queryClient = useQueryClient();

  const subscribe = useCallback(
    (onStoreChange: () => void) => queryClient.getQueryCache().subscribe(onStoreChange),
    [queryClient]
  );

  const getTaskCount = useCallback(() => {
    const queryList = queryClient.getQueryCache().findAll({ queryKey: taskKeys.lists() });

    let latestUpdatedAt = 0;
    let taskCount: number | null = null;

    for (const query of queryList) {
      if (hasTaskList(query.state.data) && query.state.dataUpdatedAt >= latestUpdatedAt) {
        latestUpdatedAt = query.state.dataUpdatedAt;
        taskCount = query.state.data.taskList.length;
      }
    }

    return taskCount;
  }, [queryClient]);

  return useSyncExternalStore(subscribe, getTaskCount, () => null);
};
