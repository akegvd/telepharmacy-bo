import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { formatTaskDate, getNextStatus, getServiceTypeLabel } from './taskDisplay';

describe('formatTaskDate', () => {
  it('formats a parseable date', () => {
    expect(formatTaskDate('2026-08-09T09:00:00.000Z')).toMatch(/^Aug 9, \d{2}:\d{2} (AM|PM)$/);
  });

  it('returns the raw value when it cannot be parsed', () => {
    expect(formatTaskDate('not-a-date')).toBe('not-a-date');
  });

  it('returns an empty string for an empty value', () => {
    expect(formatTaskDate('')).toBe('');
  });

  it('returns an empty string for a null value', () => {
    expect(formatTaskDate(null)).toBe('');
  });
});

describe('getNextStatus', () => {
  it('advances a known status', () => {
    expect(getNextStatus(TASK_STATUS.NEW)).toBe(TASK_STATUS.IN_PROGRESS);
  });

  it('returns null for a terminal or unrecognized status', () => {
    expect(getNextStatus(TASK_STATUS.COMPLETED)).toBeNull();
    expect(getNextStatus('archived')).toBeNull();
  });
});

describe('getServiceTypeLabel', () => {
  it('labels a known service type', () => {
    expect(getServiceTypeLabel(SERVICE_TYPE.CHAT)).toBe('Chat');
  });

  it('falls back to the raw value for an unknown service type', () => {
    expect(getServiceTypeLabel('carrier_pigeon')).toBe('carrier_pigeon');
  });
});
