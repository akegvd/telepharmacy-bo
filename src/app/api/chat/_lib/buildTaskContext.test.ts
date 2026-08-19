import { listTasks } from '../../tasks/_lib/tasksStore';

import { buildTaskContext } from './buildTaskContext';

jest.mock('../../tasks/_lib/tasksStore');

const mockListTasks = listTasks as jest.MockedFunction<typeof listTasks>;

describe('buildTaskContext', () => {
  beforeEach(() => {
    mockListTasks.mockReset();
  });

  it('summarizes tasks using the same labels as the dashboard', () => {
    mockListTasks.mockReturnValue([
      {
        id: '1',
        customerName: 'Somchai Prasert',
        serviceType: 'video_call',
        symptom: 'Persistent dry cough',
        status: 'new',
        createdAt: '2026-06-30T08:12:00.000Z',
      },
      { id: '2', customerName: null, serviceType: 'phone_call', symptom: '', status: 'unknown', createdAt: '' },
    ]);

    const context = buildTaskContext();

    expect(context.total).toBe(2);
    expect(context.flaggedCount).toBe(1);
    expect(context.tasks[0]).toMatchObject({
      id: '1',
      customerName: 'Somchai Prasert',
      serviceType: 'Video call',
      status: 'New',
      hasDataIssue: false,
    });
    expect(context.tasks[1].hasDataIssue).toBe(true);
  });

  it('returns an empty context when there are no tasks', () => {
    mockListTasks.mockReturnValue([]);

    expect(buildTaskContext()).toEqual({ total: 0, flaggedCount: 0, statusCounts: expect.any(Object), tasks: [] });
  });
});
