import { AxiosResponse } from 'axios';

import tasksApiEndpoints from '@/shared/constants/apiEndpoints/tasks';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import axiosInstance from '@/shared/services/axios';
import { ITaskItemResponse } from '@/shared/types/api/tasks';
import { IUpdateTaskStatusRequest } from '@/shared/types/api/tasks/detail';
import { IActionOptions } from '@/shared/types/service';

export const fetchTaskList = (options?: IActionOptions): Promise<ITaskItemResponse[]> =>
  axiosInstance
    .get<ITaskItemResponse[], AxiosResponse<ITaskItemResponse[]>>(tasksApiEndpoints.list, {
      signal: options?.controller?.signal,
    })
    .then((res) => res.data);

export const fetchTask = (id: string, options?: IActionOptions): Promise<ITaskItemResponse> =>
  axiosInstance
    .get<ITaskItemResponse, AxiosResponse<ITaskItemResponse>>(tasksApiEndpoints.detail(id), {
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
