import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { fetchTasks } from "@/shared/services/api/tasks";

import { taskKeys } from "./taskKeys";

interface IUseTasksInquiryOptions<T> {
  transformResponse: (data: unknown[]) => T;
}

const useTasksInquiry = <T>(
  { transformResponse }: IUseTasksInquiryOptions<T>,
  queryOptions?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) =>
  useQuery<T>({
    queryKey: taskKeys.all,
    queryFn: () => fetchTasks().then(transformResponse),
    ...queryOptions,
  });

export default useTasksInquiry;
