import { transformTaskListResponse } from '@/modules/dashboard/utils/transforms/transformTaskListResponse';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { listTasks } from '../../tasks/_lib/tasksStore';

export interface IChatContextTask {
  id: string;
  customerName: string;
  serviceType: string;
  status: string;
  symptom: string;
  createdAt: string;
  hasDataIssue: boolean;
}

export interface IChatTaskContext {
  total: number;
  flaggedCount: number;
  statusCounts: Record<string, number>;
  tasks: IChatContextTask[];
}

/**
 * Reuses the dashboard's own transform so the assistant's labels (status, service
 * type, flagged rows) always match what an admin sees on screen — the LLM only ever
 * summarizes numbers computed here, it never counts anything itself.
 */
export const buildTaskContext = (): IChatTaskContext => {
  const { taskList, summary } = transformTaskListResponse(listTasks() as unknown as ITaskItemResponse[]);

  return {
    total: summary.total,
    flaggedCount: summary.flaggedCount,
    statusCounts: summary.statusCounts,
    tasks: taskList.map((task) => ({
      id: task.id,
      customerName: task.displayCustomerName,
      serviceType: task.displayServiceType,
      status: task.displayStatus,
      symptom: task.displaySymptom,
      createdAt: task.displayCreatedAt,
      hasDataIssue: task.issues.length > 0,
    })),
  };
};
