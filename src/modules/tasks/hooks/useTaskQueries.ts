"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchTask, fetchTasks, updateTaskStatus } from "../services/taskApi";
import { Status } from "../types/task";

export const taskKeys = {
  all: ["tasks"] as const,
  detail: (id: string) => ["tasks", id] as const,
};

/** Polls every 15s so newly created requests show up without a manual refresh. */
export function useTasksQuery() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: fetchTasks,
    refetchInterval: 15_000,
  });
}

export function useTaskQuery(id: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => fetchTask(id),
    initialData: () =>
      queryClient
        .getQueryData<Awaited<ReturnType<typeof fetchTasks>>>(taskKeys.all)
        ?.tasks.find((task) => task.id === id),
  });
}

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      updateTaskStatus(id, status),
    onSuccess: (updated) => {
      if (!updated) return;
      queryClient.setQueryData(taskKeys.detail(updated.id), updated);
      queryClient.setQueryData<Awaited<ReturnType<typeof fetchTasks>>>(
        taskKeys.all,
        (current) =>
          current && {
            ...current,
            tasks: current.tasks.map((task) =>
              task.id === updated.id ? updated : task,
            ),
          },
      );
    },
  });
}
