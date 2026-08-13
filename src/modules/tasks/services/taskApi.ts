import axiosInstance from "@/shared/services/axios";

import { normalizeTasks } from "../utils/normalizeTask";
import { NormalizedTask, Status } from "../types/task";

export type FetchTasksResult = {
  tasks: NormalizedTask[];
  duplicateIds: string[];
};

export async function fetchTasks(): Promise<FetchTasksResult> {
  const { data } = await axiosInstance.get<unknown[]>("/tasks");
  return normalizeTasks(data);
}

export async function fetchTask(id: string): Promise<NormalizedTask | null> {
  const { data } = await axiosInstance.get<unknown>(`/tasks/${id}`);
  return normalizeTasks([data]).tasks[0] ?? null;
}

export async function updateTaskStatus(
  id: string,
  status: Status,
): Promise<NormalizedTask | null> {
  const { data } = await axiosInstance.patch<unknown>(`/tasks/${id}`, { status });
  return normalizeTasks([data]).tasks[0] ?? null;
}
