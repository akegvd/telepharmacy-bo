import dayjs from 'dayjs';

import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { ALL } from '../../constants/filters';

import { transformTaskListRequest } from './transformTaskListRequest';

const NO_FILTERS = { customerName: '', serviceType: ALL, status: ALL, createdFrom: '', createdTo: '' };
const startOfDayIso = (date: string) => dayjs(date).startOf('day').toISOString();
const endOfDayIso = (date: string) => dayjs(date).endOf('day').toISOString();

describe('transformTaskListRequest', () => {
  it('returns an empty params object when no filters are set', () => {
    expect(transformTaskListRequest(NO_FILTERS)).toEqual({});
  });

  it('maps customer name to a partial-match param', () => {
    expect(transformTaskListRequest({ ...NO_FILTERS, customerName: '  Anong  ' })).toEqual({
      customerName_like: 'Anong',
    });
  });

  it('maps a known service type to an exact-match param', () => {
    expect(transformTaskListRequest({ ...NO_FILTERS, serviceType: SERVICE_TYPE.CHAT })).toEqual({
      serviceType: SERVICE_TYPE.CHAT,
    });
  });

  it('maps a known status to an exact-match param', () => {
    expect(transformTaskListRequest({ ...NO_FILTERS, status: TASK_STATUS.COMPLETED })).toEqual({
      status: TASK_STATUS.COMPLETED,
    });
  });

  it('ignores unknown service type and status values', () => {
    expect(transformTaskListRequest({ ...NO_FILTERS, serviceType: 'bogus', status: 'bogus' })).toEqual({});
  });

  it('maps createdFrom to the start of that day', () => {
    expect(transformTaskListRequest({ ...NO_FILTERS, createdFrom: '2026-08-01' })).toEqual({
      createdAt_gte: startOfDayIso('2026-08-01'),
    });
  });

  it('maps createdTo to the end of that day', () => {
    expect(transformTaskListRequest({ ...NO_FILTERS, createdTo: '2026-08-15' })).toEqual({
      createdAt_lte: endOfDayIso('2026-08-15'),
    });
  });

  it('ignores malformed date values', () => {
    expect(transformTaskListRequest({ ...NO_FILTERS, createdFrom: 'not-a-date', createdTo: '2026-13-40' })).toEqual({});
  });

  it('combines all filters into one params object', () => {
    expect(
      transformTaskListRequest({
        customerName: 'som',
        serviceType: SERVICE_TYPE.VIDEO_CALL,
        status: TASK_STATUS.NEW,
        createdFrom: '2026-08-01',
        createdTo: '2026-08-15',
      })
    ).toEqual({
      customerName_like: 'som',
      serviceType: SERVICE_TYPE.VIDEO_CALL,
      status: TASK_STATUS.NEW,
      createdAt_gte: startOfDayIso('2026-08-01'),
      createdAt_lte: endOfDayIso('2026-08-15'),
    });
  });
});
