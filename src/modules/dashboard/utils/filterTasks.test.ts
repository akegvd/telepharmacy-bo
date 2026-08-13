import { ITransformTask } from '../types/utils/transforms/transformTask';

import { filterTasks } from './filterTasks';

function makeTask(overrides: Partial<ITransformTask>): ITransformTask {
  return {
    id: '1',
    customerName: 'Somchai P.',
    displayCustomerName: 'Somchai P.',
    serviceType: 'video_call',
    displayServiceType: 'video_call',
    status: 'new',
    displayStatus: 'new',
    displaySymptom: 'Cough',
    displayCreatedAt: '2026-08-09T09:00:00.000Z',
    issues: [],
    raw: {
      customerName: 'Somchai P.',
      serviceType: 'video_call',
      symptom: 'Cough',
      status: 'new',
      createdAt: '2026-08-09T09:00:00.000Z',
    },
    ...overrides,
  };
}

describe('filterTasks', () => {
  const tasks = [
    makeTask({ id: '1', customerName: 'Somchai P.', serviceType: 'video_call', status: 'new' }),
    makeTask({ id: '2', customerName: 'Anong W.', serviceType: 'chat', status: 'in_progress' }),
    makeTask({ id: '3', customerName: 'Kittipong S.', serviceType: 'voice_call', status: 'completed' }),
  ];

  it('returns every task when no filters are set', () => {
    expect(filterTasks(tasks, { q: '', service: 'all', status: 'all' })).toHaveLength(3);
  });

  it('matches customer name case-insensitively', () => {
    const result = filterTasks(tasks, { q: 'anong', service: 'all', status: 'all' });
    expect(result.map((t) => t.id)).toEqual(['2']);
  });

  it('filters by service type', () => {
    const result = filterTasks(tasks, { q: '', service: 'chat', status: 'all' });
    expect(result.map((t) => t.id)).toEqual(['2']);
  });

  it('filters by status', () => {
    const result = filterTasks(tasks, { q: '', service: 'all', status: 'completed' });
    expect(result.map((t) => t.id)).toEqual(['3']);
  });

  it('combines search, service, and status filters', () => {
    const result = filterTasks(tasks, { q: 'som', service: 'video_call', status: 'new' });
    expect(result.map((t) => t.id)).toEqual(['1']);
  });
});
