import dayjs from 'dayjs';

import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { mapDisplayServiceTypeLabelByServiceType } from '../constants/mapDisplayServiceTypeLabelByServiceType';
import { mapNextStatusByStatus } from '../constants/mapNextStatusByStatus';

/** A status with no entry in mapNextStatusByStatus is unrecognized and can't be advanced. */
export const getNextStatus = (status: string): TASK_STATUS | null => {
  return (mapNextStatusByStatus as Partial<Record<string, TASK_STATUS | null>>)[status] ?? null;
};

/** Known service types get a friendly label; anything else falls back to the raw value from the source data. */
export const getServiceTypeLabel = (serviceType: string): string => {
  return (mapDisplayServiceTypeLabelByServiceType as Partial<Record<string, string>>)[serviceType] ?? serviceType;
};

/** Falls back to the raw value from the source data when it's missing or couldn't be parsed. */
export const formatTaskDate = (value: string | null): string => {
  if (!value) {
    return value ?? '';
  }

  const parsed = dayjs(value);

  return parsed.isValid() ? parsed.format('MMM D, hh:mm A') : value;
};
