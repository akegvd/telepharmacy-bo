import { useQueryClient } from '@tanstack/react-query';

import { ITransformTaskListResponse } from '@/modules/dashboard/types/utils/transforms/transformTaskListResponse';
import {
  buildTaskListSummary,
  transformTaskItemResponse,
} from '@/modules/dashboard/utils/transforms/transformTaskListResponse';

import { taskKeys } from './taskKeys';
import useUpdateTaskStatus from './useUpdateTaskStatus';

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useUpdateTaskStatus(
    { transformResponse: transformTaskItemResponse },
    {
      onSuccess: (updated) => {
        if (!updated) {
          return;
        }
        queryClient.setQueryData(taskKeys.detail(updated.id), updated);
        queryClient.setQueryData<ITransformTaskListResponse>(taskKeys.all, (current) => {
          if (!current) {
            return current;
          }
          const taskList = current.taskList.map((task) => (task.id === updated.id ? updated : task));
          return { taskList, summary: buildTaskListSummary(taskList) };
        });
      },
    }
  );
};
