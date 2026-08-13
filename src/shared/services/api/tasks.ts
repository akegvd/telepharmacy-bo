import { AxiosResponse } from 'axios';

import tasksApiEndpoints from '@/shared/constants/apiEndpoints/tasks';
import axiosInstance from '@/shared/services/axios';
import { IActionOptions } from '@/shared/types/service';

export const fetchTasks = (options?: IActionOptions): Promise<unknown[]> =>
  axiosInstance
    .get<unknown[], AxiosResponse<unknown[]>>(tasksApiEndpoints.list, {
      signal: options?.controller?.signal,
    })
    .then((res) => res.data);

export const fetchTask = (id: string, options?: IActionOptions): Promise<unknown> =>
  axiosInstance
    .get<unknown, AxiosResponse<unknown>>(tasksApiEndpoints.detail(id), {
      signal: options?.controller?.signal,
    })
    .then((res) => res.data);

export const updateTaskStatus = (id: string, status: string, options?: IActionOptions): Promise<unknown> =>
  axiosInstance
    .patch<unknown, AxiosResponse<unknown>>(
      tasksApiEndpoints.detail(id),
      { status },
      { signal: options?.controller?.signal }
    )
    .then((res) => res.data);
