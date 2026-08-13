import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { ITransformTask } from './transformTask';

/** Precomputed once per fetch so components can read counts by key instead of re-scanning `taskList`. */
export interface ITaskListSummary {
  total: number;
  flaggedCount: number;
  statusCounts: Record<TASK_STATUS, number>;
}

export interface ITransformTaskListResponse {
  taskList: ITransformTask[];
  summary: ITaskListSummary;
}
