import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import DATA_ISSUE from '../../../enums/dataIssue';
import { TStatusColor } from '../../taskStatus';

export interface ITransformTaskItemResponse extends Pick<
  ITaskItemResponse,
  'customerName' | 'serviceType' | 'status' | 'symptom' | 'createdAt'
> {
  id: string;
  displayCustomerName: string;
  displayServiceType: string;
  displayStatus: string;
  displayStatusColor: TStatusColor | null;
  displaySymptom: string;
  displayCreatedAt: string;
  nextStatus: TASK_STATUS | null;
  displayNextStatus: string;
  displayNextStatusColor: TStatusColor | null;
  issues: DATA_ISSUE[];
}

export interface ITaskListSummary {
  total: number;
  flaggedCount: number;
  statusCounts: Record<TASK_STATUS, number>;
}

export interface ITransformTaskListResponse {
  taskList: ITransformTaskItemResponse[];
  summary: ITaskListSummary;
}
