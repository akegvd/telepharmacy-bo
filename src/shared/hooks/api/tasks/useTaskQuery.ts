import { useQueryClient } from '@tanstack/react-query';

import { ITransformTaskListResponse } from '@/modules/dashboard/types/utils/transforms/transformTaskListResponse';
import { transformTaskItemResponse } from '@/modules/dashboard/utils/transforms/transformTaskListResponse';

import { taskKeys } from './taskKeys';
import useTaskInquiry from './useTaskInquiry';

export const useTaskQuery = (id: string) => {
  const queryClient = useQueryClient();

  return useTaskInquiry(
    id,
    { transformResponse: transformTaskItemResponse },
    {
      initialData: () =>
        queryClient.getQueryData<ITransformTaskListResponse>(taskKeys.all)?.taskList.find((task) => task.id === id),
    }
  );
};
