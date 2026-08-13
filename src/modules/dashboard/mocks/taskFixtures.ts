import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { ITransformTask } from '../types/utils/transforms/transformTask';
import { getServiceTypeLabel } from '../utils/taskDisplay';

const DEFAULTS: ITransformTask = {
  id: '1',
  customerName: 'Somchai P.',
  displayCustomerName: 'Somchai P.',
  serviceType: SERVICE_TYPE.VIDEO_CALL,
  displayServiceType: getServiceTypeLabel(SERVICE_TYPE.VIDEO_CALL),
  status: TASK_STATUS.NEW,
  displayStatus: TASK_STATUS.NEW,
  displaySymptom: 'Persistent dry cough',
  displayCreatedAt: '2026-08-09T09:12:00.000Z',
  issues: [],
  raw: {
    customerName: 'Somchai P.',
    serviceType: 'video_call',
    symptom: 'Persistent dry cough',
    status: 'new',
    createdAt: '2026-08-09T09:12:00.000Z',
  },
};

export const makeTask = (overrides: Partial<ITransformTask> = {}): ITransformTask => {
  const task: ITransformTask = { ...DEFAULTS, ...overrides };

  if (overrides.customerName && !overrides.displayCustomerName) {
    task.displayCustomerName = overrides.customerName;
  }
  if (overrides.serviceType && !overrides.displayServiceType) {
    task.displayServiceType = getServiceTypeLabel(overrides.serviceType);
  }
  if (overrides.status && !overrides.displayStatus) {
    task.displayStatus = overrides.status;
  }

  if (!overrides.raw) {
    task.raw = {
      customerName: task.customerName,
      serviceType: task.serviceType,
      symptom: task.displaySymptom,
      status: task.status,
      createdAt: task.displayCreatedAt,
    };
  }

  return task;
};
