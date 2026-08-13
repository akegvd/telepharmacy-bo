import TASK_STATUS from '@/shared/enums/api/tasks/status';

export const mapDisplayStatusLabelByStatus: Record<TASK_STATUS, string> = {
  [TASK_STATUS.NEW]: 'New',
  [TASK_STATUS.IN_PROGRESS]: 'In progress',
  [TASK_STATUS.COMPLETED]: 'Completed',
};
