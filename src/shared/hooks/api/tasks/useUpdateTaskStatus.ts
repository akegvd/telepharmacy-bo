import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { updateTaskStatus } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';
import { IActionOptions } from '@/shared/types/service';

interface IUseUpdateTaskStatusOptions<T> {
  transformResponse: (data: ITaskItemResponse) => T;
}

interface IUseUpdateTaskStatusParams {
  id: string;
  status: TASK_STATUS;
  options?: IActionOptions;
}

const useUpdateTaskStatus = <T>(
  { transformResponse }: IUseUpdateTaskStatusOptions<T>,
  mutationOptions?: Omit<UseMutationOptions<T, unknown, IUseUpdateTaskStatusParams>, 'mutationFn'>
) =>
  useMutation<T, unknown, IUseUpdateTaskStatusParams>({
    mutationFn: ({ id, status, options }) => updateTaskStatus(id, status, options).then(transformResponse),
    ...mutationOptions,
  });

export default useUpdateTaskStatus;
