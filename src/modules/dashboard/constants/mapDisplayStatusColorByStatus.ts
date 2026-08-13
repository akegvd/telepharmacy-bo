import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { TStatusColor } from '../types/taskStatus';

export const mapDisplayStatusColorByStatus: Record<TASK_STATUS, TStatusColor> = {
  [TASK_STATUS.NEW]: 'info',
  [TASK_STATUS.IN_PROGRESS]: 'warning',
  [TASK_STATUS.COMPLETED]: 'success',
};
