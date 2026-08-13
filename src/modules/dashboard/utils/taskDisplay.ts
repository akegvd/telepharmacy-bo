import dayjs from 'dayjs';

import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { mapDisplayServiceTypeLabelByServiceType } from '../constants/mapDisplayServiceTypeLabelByServiceType';
import { mapDisplayTaskStatusLabelByStatus } from '../constants/mapDisplayTaskStatusLabelByStatus';
import { mapNextStatusByStatus } from '../constants/mapNextStatusByStatus';

export const getNextStatus = (status?: string): TASK_STATUS | null => {
  if (!status) {
    return null;
  }

  return (mapNextStatusByStatus as Partial<Record<string, TASK_STATUS | null>>)[status] ?? null;
};

export const getTaskStatusLabel = (status?: string): string => {
  if (!status) {
    return '';
  }

  return (mapDisplayTaskStatusLabelByStatus as Partial<Record<string, string>>)[status] ?? status;
};

export const getServiceTypeLabel = (serviceType?: string): string => {
  if (!serviceType) {
    return '';
  }

  return (mapDisplayServiceTypeLabelByServiceType as Partial<Record<string, string>>)[serviceType] ?? serviceType;
};

export const formatTaskDate = (value?: string | null): string => {
  if (!value) {
    return '';
  }

  const parsed = dayjs(value);

  return parsed.isValid() ? parsed.format('MMM D, hh:mm A') : '';
};
