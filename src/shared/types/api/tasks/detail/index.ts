import TASK_STATUS from '@/shared/enums/api/tasks/status';

export interface IUpdateTaskStatusRequest {
  status: TASK_STATUS;
}
