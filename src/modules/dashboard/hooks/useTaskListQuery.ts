import { taskListAutoRefreshIntervalMs } from '@/modules/dashboard/constants/taskList';
import { transformTaskListResponse } from '@/modules/dashboard/utils/transforms/transformTaskListResponse';
import useTaskListInquiry from '@/shared/hooks/api/tasks/useTaskListInquiry';

interface IUseTaskListQueryOptions {
  isAutoRefreshEnabled?: boolean;
}

/** Polls every 15s so newly created requests show up without a manual refresh; pause via isAutoRefreshEnabled. */
export const useTaskListQuery = ({ isAutoRefreshEnabled = true }: IUseTaskListQueryOptions = {}) => {
  return useTaskListInquiry(
    { transformResponse: transformTaskListResponse },
    { refetchInterval: isAutoRefreshEnabled ? taskListAutoRefreshIntervalMs : false }
  );
};
