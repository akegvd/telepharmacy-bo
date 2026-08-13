import dayjs from 'dayjs';

import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { taskStatusOptionList } from '../../constants/taskStatusOptionList';
import DATA_ISSUE from '../../enums/dataIssue';
import { ITransformTask } from '../../types/utils/transforms/transformTask';
import { ITaskListSummary, ITransformTaskListResponse } from '../../types/utils/transforms/transformTaskListResponse';
import { getServiceTypeLabel } from '../taskDisplay';

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

export const transformTaskItemResponse = (resItem: ITaskItemResponse): ITransformTask | null => {
  if (typeof resItem !== 'object' || resItem === null) {
    return null;
  }

  const raw = resItem as unknown as Record<string, unknown>;
  const id = raw.id;
  if (!isNonEmptyString(id) && typeof id !== 'number') {
    return null;
  }

  const issues: DATA_ISSUE[] = [];

  const customerName = isNonEmptyString(raw.customerName)
    ? raw.customerName.trim()
    : (issues.push(DATA_ISSUE.MISSING_NAME), '');

  const serviceType = isNonEmptyString(raw.serviceType) ? raw.serviceType.trim() : '';
  if (!(Object.values(SERVICE_TYPE) as string[]).includes(serviceType)) {
    issues.push(DATA_ISSUE.UNKNOWN_SERVICE_TYPE);
  }

  const status = isNonEmptyString(raw.status) ? raw.status.trim() : '';
  if (!(Object.values(TASK_STATUS) as string[]).includes(status)) {
    issues.push(DATA_ISSUE.UNKNOWN_STATUS);
  }

  const symptom = isNonEmptyString(raw.symptom) ? raw.symptom.trim() : (issues.push(DATA_ISSUE.MISSING_SYMPTOM), '');

  const createdAtRaw = raw.createdAt;
  const displayCreatedAt = isNonEmptyString(createdAtRaw) ? createdAtRaw.trim() : null;
  if (displayCreatedAt === null || !dayjs(displayCreatedAt).isValid()) {
    issues.push(DATA_ISSUE.INVALID_DATE);
  }

  return {
    id: String(id),
    customerName,
    displayCustomerName: customerName,
    serviceType,
    displayServiceType: getServiceTypeLabel(serviceType),
    status,
    displayStatus: status,
    displaySymptom: symptom,
    displayCreatedAt,
    issues,
    raw: {
      customerName: raw.customerName,
      serviceType: raw.serviceType,
      status: raw.status,
      symptom: raw.symptom,
      createdAt: raw.createdAt,
    },
  };
};

export const buildTaskListSummary = (taskList: ITransformTask[]): ITaskListSummary => {
  const statusCounts = Object.fromEntries(taskStatusOptionList.map((status) => [status, 0])) as Record<
    TASK_STATUS,
    number
  >;

  let flaggedCount = 0;
  for (const task of taskList) {
    if (task.status in statusCounts) {
      statusCounts[task.status as TASK_STATUS] += 1;
    }
    if (task.issues.length > 0) {
      flaggedCount += 1;
    }
  }

  return { total: taskList.length, flaggedCount, statusCounts };
};

export const transformTaskListResponse = (res: ITaskItemResponse[]): ITransformTaskListResponse => {
  const taskList = res.map(transformTaskItemResponse) as ITransformTask[];

  return { taskList, summary: buildTaskListSummary(taskList) };
};
