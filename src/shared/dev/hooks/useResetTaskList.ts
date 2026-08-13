import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { resetTaskList } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

const useResetTaskList = (
  mutationOptions?: Omit<UseMutationOptions<ITaskItemResponse[], unknown, void>, 'mutationFn'>
) =>
  useMutation<ITaskItemResponse[], unknown, void>({
    mutationFn: () => resetTaskList(),
    ...mutationOptions,
  });

export default useResetTaskList;
