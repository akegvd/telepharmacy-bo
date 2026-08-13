import { useQuery, UseQueryOptions } from '@tanstack/react-query';

import { fetchTaskList } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { taskKeys } from './taskKeys';

interface IUseTaskListInquiryOptions<T> {
  transformResponse: (data: ITaskItemResponse[]) => T;
}

const useTaskListInquiry = <T>(
  { transformResponse }: IUseTaskListInquiryOptions<T>,
  queryOptions?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) =>
  useQuery<T>({
    queryKey: taskKeys.all,
    queryFn: () => fetchTaskList().then(transformResponse),
    ...queryOptions,
  });

export default useTaskListInquiry;
