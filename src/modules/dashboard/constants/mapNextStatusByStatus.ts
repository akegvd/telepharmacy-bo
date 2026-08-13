import TASK_STATUS from '@/shared/enums/api/tasks/status';

export const mapNextStatusByStatus: Record<TASK_STATUS, TASK_STATUS | null> = {
  [TASK_STATUS.NEW]: TASK_STATUS.IN_PROGRESS,
  [TASK_STATUS.IN_PROGRESS]: TASK_STATUS.COMPLETED,
  [TASK_STATUS.COMPLETED]: null,
};
