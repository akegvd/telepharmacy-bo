import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { mapDisplayStatusColorByStatus } from '../../constants/mapDisplayStatusColorByStatus';
import { taskStatusOptionList } from '../../constants/taskStatusOptionList';
import DATA_ISSUE from '../../enums/dataIssue';
import {
  ITaskListSummary,
  ITransformTaskItemResponse,
  ITransformTaskListResponse,
} from '../../types/utils/transforms/transformTaskListResponse';
import { formatTaskDate, getNextStatus, getServiceTypeLabel, getTaskStatusLabel } from '../taskDisplay';

const isKnownServiceType = (serviceType: unknown): serviceType is SERVICE_TYPE => {
  return Object.values(SERVICE_TYPE).includes(serviceType as SERVICE_TYPE);
};

const isKnownStatus = (status: unknown): status is TASK_STATUS => {
  return Object.values(TASK_STATUS).includes(status as TASK_STATUS);
};

const hasUsableId = (id: unknown): id is string | number => {
  if (typeof id === 'number') {
    return true;
  }

  return typeof id === 'string' && id.trim().length > 0;
};

export const transformTaskItemResponse = (resItem: ITaskItemResponse): ITransformTaskItemResponse | null => {
  if (!hasUsableId(resItem.id)) {
    return null;
  }

  const issues: DATA_ISSUE[] = [];

  if (!resItem.customerName) {
    issues.push(DATA_ISSUE.MISSING_NAME);
  }

  if (!isKnownServiceType(resItem.serviceType)) {
    issues.push(DATA_ISSUE.UNKNOWN_SERVICE_TYPE);
  }

  if (!isKnownStatus(resItem.status)) {
    issues.push(DATA_ISSUE.UNKNOWN_STATUS);
  }

  if (!resItem.symptom) {
    issues.push(DATA_ISSUE.MISSING_SYMPTOM);
  }

  const displayCreatedAt = formatTaskDate(resItem.createdAt);

  if (!displayCreatedAt) {
    issues.push(DATA_ISSUE.INVALID_DATE);
  }

  const nextStatus = issues.length > 0 ? null : getNextStatus(resItem.status);

  return {
    id: String(resItem.id),
    customerName: resItem.customerName,
    displayCustomerName: resItem.customerName ?? '',
    serviceType: resItem.serviceType,
    displayServiceType: getServiceTypeLabel(resItem.serviceType),
    status: resItem.status,
    displayStatus: getTaskStatusLabel(resItem.status),
    displayStatusColor: isKnownStatus(resItem.status) ? mapDisplayStatusColorByStatus[resItem.status] : null,
    symptom: resItem.symptom,
    displaySymptom: resItem.symptom ?? '',
    createdAt: resItem.createdAt,
    displayCreatedAt,
    nextStatus,
    displayNextStatus: nextStatus ? getTaskStatusLabel(nextStatus) : '',
    displayNextStatusColor: nextStatus ? mapDisplayStatusColorByStatus[nextStatus] : null,
    issues,
  };
};

export const buildTaskListSummary = (taskList: ITransformTaskItemResponse[]): ITaskListSummary => {
  const statusCounts = Object.fromEntries(taskStatusOptionList.map((status) => [status, 0])) as Record<
    TASK_STATUS,
    number
  >;

  let flaggedCount = 0;
  for (const task of taskList) {
    const status = task.status;

    if (status && status in statusCounts) {
      statusCounts[status] += 1;
    }

    if (task.issues.length > 0) {
      flaggedCount += 1;
    }
  }

  return { total: taskList.length, flaggedCount, statusCounts };
};

export const transformTaskListResponse = (res: ITaskItemResponse[]): ITransformTaskListResponse => {
  const taskList = res.map((item) => {
    const task = transformTaskItemResponse(item);

    if (!task) {
      throw new Error('Unable to transform task item response');
    }

    return task;
  });

  return { taskList, summary: buildTaskListSummary(taskList) };
};
