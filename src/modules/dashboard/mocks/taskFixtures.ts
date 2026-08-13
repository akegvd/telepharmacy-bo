import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { mapDisplayStatusColorByStatus } from '../constants/mapDisplayStatusColorByStatus';
import { TStatusColor } from '../types/taskStatus';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';
import { formatTaskDate, getNextStatus, getServiceTypeLabel, getTaskStatusLabel } from '../utils/taskDisplay';

const DEFAULTS: ITransformTaskItemResponse = {
  id: '1',
  customerName: 'Somchai P.',
  displayCustomerName: 'Somchai P.',
  serviceType: SERVICE_TYPE.VIDEO_CALL,
  displayServiceType: getServiceTypeLabel(SERVICE_TYPE.VIDEO_CALL),
  status: TASK_STATUS.NEW,
  displayStatus: getTaskStatusLabel(TASK_STATUS.NEW),
  displayStatusColor: mapDisplayStatusColorByStatus[TASK_STATUS.NEW],
  symptom: 'Persistent dry cough',
  displaySymptom: 'Persistent dry cough',
  createdAt: '2026-08-09T09:12:00.000Z',
  displayCreatedAt: formatTaskDate('2026-08-09T09:12:00.000Z'),
  nextStatus: TASK_STATUS.IN_PROGRESS,
  displayNextStatus: getTaskStatusLabel(TASK_STATUS.IN_PROGRESS),
  displayNextStatusColor: mapDisplayStatusColorByStatus[TASK_STATUS.IN_PROGRESS],
  issues: [],
};

export const makeTask = (overrides: Partial<ITransformTaskItemResponse> = {}): ITransformTaskItemResponse => {
  const task: ITransformTaskItemResponse = { ...DEFAULTS, ...overrides };

  if (overrides.customerName && !overrides.displayCustomerName) {
    task.displayCustomerName = overrides.customerName;
  }

  if (overrides.serviceType && !overrides.displayServiceType) {
    task.displayServiceType = getServiceTypeLabel(overrides.serviceType);
  }

  if (overrides.status && !overrides.displayStatus) {
    task.displayStatus = getTaskStatusLabel(overrides.status);
  }

  if (overrides.status && overrides.displayStatusColor === undefined) {
    task.displayStatusColor =
      (mapDisplayStatusColorByStatus as Partial<Record<string, TStatusColor>>)[overrides.status] ?? null;
  }

  if (overrides.symptom !== undefined && overrides.displaySymptom === undefined) {
    task.displaySymptom = overrides.symptom;
  }

  if (overrides.createdAt !== undefined && overrides.displayCreatedAt === undefined) {
    task.displayCreatedAt = formatTaskDate(overrides.createdAt);
  }

  if (overrides.nextStatus === undefined) {
    task.nextStatus = task.issues.length > 0 ? null : getNextStatus(task.status);

    task.displayNextStatus = task.nextStatus ? getTaskStatusLabel(task.nextStatus) : '';
    task.displayNextStatusColor = task.nextStatus ? mapDisplayStatusColorByStatus[task.nextStatus] : null;
  }

  return task;
};
