import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { fetchTaskList } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';
import { ITaskListRequestParams } from '@/shared/types/api/tasks/list';

import { taskKeys } from './taskKeys';

interface IUseTaskListInquiryOptions<T> {
  params?: ITaskListRequestParams;
  transformResponse: (data: ITaskItemResponse[]) => T;
}

const useTaskListInquiry = <T>(
  { params, transformResponse }: IUseTaskListInquiryOptions<T>,
  queryOptions?: Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>
) =>
  useQuery<T>({
    queryKey: taskKeys.list(params),
    queryFn: () => fetchTaskList(params).then(transformResponse),
    // Changing a filter changes the query key; without this the list would unmount
    // into a loading spinner on every keystroke that lands in the URL.
    placeholderData: keepPreviousData,
    ...queryOptions,
  });

export default useTaskListInquiry;
