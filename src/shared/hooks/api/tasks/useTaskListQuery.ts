import { transformTaskListResponse } from '@/modules/dashboard/utils/transforms/transformTaskListResponse';

import useTaskListInquiry from './useTaskListInquiry';

/** Polls every 15s so newly created requests show up without a manual refresh. */
export const useTaskListQuery = () => {
  return useTaskListInquiry({ transformResponse: transformTaskListResponse }, { refetchInterval: 15_000 });
};
