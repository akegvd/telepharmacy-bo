import { AxiosResponse } from 'axios';

import tasksApiEndpoints from '@/shared/constants/apiEndpoints/tasks';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import axiosInstance from '@/shared/services/axios';
import { ITaskItemResponse } from '@/shared/types/api/tasks';
import { IUpdateTaskStatusRequest } from '@/shared/types/api/tasks/detail';
import { ITaskListRequestParams } from '@/shared/types/api/tasks/list';
import { IActionOptions } from '@/shared/types/service';

export const fetchTaskList = (
  params?: ITaskListRequestParams,
  options?: IActionOptions
): Promise<ITaskItemResponse[]> =>
  axiosInstance
    .get<ITaskItemResponse[], AxiosResponse<ITaskItemResponse[]>>(tasksApiEndpoints.list, {
      params,
      signal: options?.controller?.signal,
    })
    .then((res) => res.data);

export const updateTaskStatus = (
  id: string,
  status: TASK_STATUS,
  options?: IActionOptions
): Promise<ITaskItemResponse> =>
  axiosInstance
    .patch<ITaskItemResponse, AxiosResponse<ITaskItemResponse>, IUpdateTaskStatusRequest>(
      tasksApiEndpoints.detail(id),
      { status },
      { signal: options?.controller?.signal }
    )
    .then((res) => res.data);

/** Dev-only: the in-memory API generates the task, so there is nothing to send. */
export const createRandomTask = (): Promise<ITaskItemResponse> =>
  axiosInstance
    .post<ITaskItemResponse, AxiosResponse<ITaskItemResponse>>(tasksApiEndpoints.list)
    .then((res) => res.data);

/** Dev-only: rolls the in-memory API back to its db.json seed. */
export const resetTaskList = (): Promise<ITaskItemResponse[]> =>
  axiosInstance
    .post<ITaskItemResponse[], AxiosResponse<ITaskItemResponse[]>>(tasksApiEndpoints.reset)
    .then((res) => res.data);
