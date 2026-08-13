import { taskListAutoRefreshIntervalMs } from '@/modules/dashboard/constants/taskList';
import { transformTaskListResponse } from '@/modules/dashboard/utils/transforms/transformTaskListResponse';
import useTaskListInquiry from '@/shared/hooks/api/tasks/useTaskListInquiry';

import { ALL } from '../constants/filters';
import { ITaskListFilters } from '../types/utils/transforms/transformTaskListRequest';
import { transformTaskListRequest } from '../utils/transforms/transformTaskListRequest';

interface IUseTaskListQueryOptions {
  isAutoRefreshEnabled?: boolean;
  filters?: ITaskListFilters;
}

const defaultFilters: ITaskListFilters = {
  customerName: '',
  serviceType: ALL,
  status: ALL,
  createdFrom: '',
  createdTo: '',
};

/** Polls every 15s so newly created requests show up without a manual refresh; pause via isAutoRefreshEnabled. */
export const useTaskListQuery = ({
  isAutoRefreshEnabled = true,
  filters = defaultFilters,
}: IUseTaskListQueryOptions = {}) => {
  return useTaskListInquiry(
    { params: transformTaskListRequest(filters), transformResponse: transformTaskListResponse },
    { refetchInterval: isAutoRefreshEnabled ? taskListAutoRefreshIntervalMs : false }
  );
};
