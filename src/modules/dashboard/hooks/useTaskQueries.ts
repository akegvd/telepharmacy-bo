'use client';

import { useQueryClient } from '@tanstack/react-query';

import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';
import useTaskInquiry from '@/shared/hooks/api/tasks/useTaskInquiry';
import useTasksInquiry from '@/shared/hooks/api/tasks/useTasksInquiry';
import useUpdateTaskStatus from '@/shared/hooks/api/tasks/useUpdateTaskStatus';

import { ITransformTasksResponse } from '../types/utils/transforms/transformTask';
import { transformTask, transformTasksResponse } from '../utils/transforms/transformTask';

export { taskKeys };

/** Polls every 15s so newly created requests show up without a manual refresh. */
export function useTasksQuery() {
  return useTasksInquiry({ transformResponse: transformTasksResponse }, { refetchInterval: 15_000 });
}

export function useTaskQuery(id: string) {
  const queryClient = useQueryClient();

  return useTaskInquiry(
    id,
    { transformResponse: transformTask },
    {
      initialData: () =>
        queryClient.getQueryData<ITransformTasksResponse>(taskKeys.all)?.tasks.find((task) => task.id === id),
    }
  );
}

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useUpdateTaskStatus(
    { transformResponse: transformTask },
    {
      onSuccess: (updated) => {
        if (!updated) return;
        queryClient.setQueryData(taskKeys.detail(updated.id), updated);
        queryClient.setQueryData<ITransformTasksResponse>(
          taskKeys.all,
          (current) =>
            current && {
              ...current,
              tasks: current.tasks.map((task) => (task.id === updated.id ? updated : task)),
            }
        );
      },
    }
  );
}
