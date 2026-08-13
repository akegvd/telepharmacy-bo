import { useQueryClient } from '@tanstack/react-query';

import { transformTaskItemResponse } from '@/modules/dashboard/utils/transforms/transformTaskListResponse';
import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';
import useUpdateTaskStatus from '@/shared/hooks/api/tasks/useUpdateTaskStatus';

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
        queryClient.invalidateQueries({ queryKey: taskKeys.all, exact: true });
      },
    }
  );
};
