import dayjs from 'dayjs';

import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { ALL } from '../../constants/filters';
import { ITaskListFilters, ITransformTaskListRequest } from '../../types/utils/transforms/transformTaskListRequest';

const DATE_VALUE_FORMAT = 'YYYY-MM-DD';
const DATE_VALUE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isKnownServiceType = (serviceType: string): serviceType is SERVICE_TYPE =>
  Object.values(SERVICE_TYPE).includes(serviceType as SERVICE_TYPE);

const isKnownStatus = (status: string): status is TASK_STATUS =>
  Object.values(TASK_STATUS).includes(status as TASK_STATUS);

// dayjs rolls overflowing parts over (`2026-13-40` becomes `2027-02-09`), so a round-trip
// comparison is what actually rejects out-of-range dates.
const isValidDateValue = (value: string): boolean =>
  DATE_VALUE_PATTERN.test(value) && dayjs(value).format(DATE_VALUE_FORMAT) === value;

export const transformTaskListRequest = ({
  customerName,
  serviceType,
  status,
  createdFrom,
  createdTo,
}: ITaskListFilters): ITransformTaskListRequest => {
  const params: ITransformTaskListRequest = {};
  const trimmedCustomerName = customerName.trim();

  if (trimmedCustomerName) {
    params.customerName_like = trimmedCustomerName;
  }

  if (serviceType !== ALL && isKnownServiceType(serviceType)) {
    params.serviceType = serviceType;
  }

  if (status !== ALL && isKnownStatus(status)) {
    params.status = status;
  }

  if (isValidDateValue(createdFrom)) {
    params.createdAt_gte = dayjs(createdFrom).startOf('day').toISOString();
  }

  if (isValidDateValue(createdTo)) {
    params.createdAt_lte = dayjs(createdTo).endOf('day').toISOString();
  }

  return params;
};
