import { ITaskListRequestParams } from '@/shared/types/api/tasks/list';

export const taskKeys = {
  all: ['tasks'],
  lists: () => ['tasks', 'list'],
  list: (params?: ITaskListRequestParams) => ['tasks', 'list', params ?? {}],
  detail: (id: string) => ['tasks', id],
};
