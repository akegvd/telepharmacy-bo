import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { makeTask } from '../mocks/taskFixtures';

import { filterTaskList } from './filterTaskList';

describe('filterTaskList', () => {
  const taskList = [
    makeTask({ id: '1', customerName: 'Somchai P.', serviceType: SERVICE_TYPE.VIDEO_CALL, status: TASK_STATUS.NEW }),
    makeTask({ id: '2', customerName: 'Anong W.', serviceType: SERVICE_TYPE.CHAT, status: TASK_STATUS.IN_PROGRESS }),
    makeTask({
      id: '3',
      customerName: 'Kittipong S.',
      serviceType: SERVICE_TYPE.VOICE_CALL,
      status: TASK_STATUS.COMPLETED,
    }),
  ];

  it('returns every task when no filters are set', () => {
    expect(filterTaskList(taskList, { q: '', service: 'all', status: 'all' })).toHaveLength(3);
  });

  it('matches customer name case-insensitively', () => {
    const result = filterTaskList(taskList, { q: 'anong', service: 'all', status: 'all' });
    expect(result.map((t) => t.id)).toEqual(['2']);
  });

  it('filters by service type', () => {
    const result = filterTaskList(taskList, { q: '', service: 'chat', status: 'all' });
    expect(result.map((t) => t.id)).toEqual(['2']);
  });

  it('filters by status', () => {
    const result = filterTaskList(taskList, { q: '', service: 'all', status: 'completed' });
    expect(result.map((t) => t.id)).toEqual(['3']);
  });

  it('combines search, service, and status filters', () => {
    const result = filterTaskList(taskList, { q: 'som', service: 'video_call', status: 'new' });
    expect(result.map((t) => t.id)).toEqual(['1']);
  });
});
