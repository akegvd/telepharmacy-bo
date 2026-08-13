import { useQuery, UseQueryOptions } from "@tanstack/react-query";

import { fetchTask } from "@/shared/services/api/tasks";

import { taskKeys } from "./taskKeys";

interface IUseTaskInquiryOptions<T> {
  transformResponse: (data: unknown) => T;
}

const useTaskInquiry = <T>(
  id: string,
  { transformResponse }: IUseTaskInquiryOptions<T>,
  queryOptions?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">,
) =>
  useQuery<T>({
    queryKey: taskKeys.detail(id),
    queryFn: () => fetchTask(id).then(transformResponse),
    ...queryOptions,
  });

export default useTaskInquiry;
