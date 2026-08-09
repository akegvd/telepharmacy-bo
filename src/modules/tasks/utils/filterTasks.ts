import { NormalizedTask } from "../types/task";

export type TaskFilters = {
  q: string;
  service: string;
  status: string;
};

export function filterTasks(tasks: NormalizedTask[], { q, service, status }: TaskFilters): NormalizedTask[] {
  const query = q.trim().toLowerCase();
  return tasks.filter((task) => {
    if (query && !task.customerName.toLowerCase().includes(query)) return false;
    if (service !== "all" && task.serviceType !== service) return false;
    if (status !== "all" && task.status !== status) return false;
    return true;
  });
}
