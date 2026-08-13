import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

export interface ITaskFilters {
  q: string;
  service: string;
  status: string;
}

export const filterTaskList = (
  taskList: ITransformTaskItemResponse[],
  { q, service, status }: ITaskFilters
): ITransformTaskItemResponse[] => {
  const query = q.trim().toLowerCase();

  return taskList.filter((task) => {
    if (query && !task.customerName?.toLowerCase().includes(query)) {
      return false;
    }
    if (service !== 'all' && task.serviceType !== service) {
      return false;
    }
    if (status !== 'all' && task.status !== status) {
      return false;
    }
    return true;
  });
};
