import { apiFetch } from "@/shared/services/httpClient";

import { normalizeTasks } from "../utils/normalizeTask";
import { NormalizedTask, Status } from "../types/task";

export type FetchTasksResult = {
  tasks: NormalizedTask[];
  duplicateIds: string[];
};

export async function fetchTasks(): Promise<FetchTasksResult> {
  const raw = await apiFetch<unknown[]>("/tasks");
  return normalizeTasks(raw);
}

export async function fetchTask(id: string): Promise<NormalizedTask | null> {
  const raw = await apiFetch<unknown>(`/tasks/${id}`);
  return normalizeTasks([raw]).tasks[0] ?? null;
}

export async function updateTaskStatus(
  id: string,
  status: Status,
): Promise<NormalizedTask | null> {
  const raw = await apiFetch<unknown>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  return normalizeTasks([raw]).tasks[0] ?? null;
}
