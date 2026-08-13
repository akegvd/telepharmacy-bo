import { ITransformTask } from '../types/utils/transforms/transformTask';

export type TTaskFilters = {
  q: string;
  service: string;
  status: string;
};

export function filterTasks(tasks: ITransformTask[], { q, service, status }: TTaskFilters): ITransformTask[] {
  const query = q.trim().toLowerCase();
  return tasks.filter((task) => {
    if (query && !task.customerName.toLowerCase().includes(query)) return false;
    if (service !== 'all' && task.serviceType !== service) return false;
    if (status !== 'all' && task.status !== status) return false;
    return true;
  });
}
