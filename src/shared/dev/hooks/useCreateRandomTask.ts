import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { createRandomTask } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

const useCreateRandomTask = (
  mutationOptions?: Omit<UseMutationOptions<ITaskItemResponse, unknown, void>, 'mutationFn'>
) =>
  useMutation<ITaskItemResponse, unknown, void>({
    mutationFn: () => createRandomTask(),
    ...mutationOptions,
  });

export default useCreateRandomTask;
