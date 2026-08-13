import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import db from '../../../../../db.json';

import { addRandomTask, findTask, listTasks, patchTask, resetTasks } from './tasksStore';

const SEED_TASK_COUNT = db.tasks.length;

describe('tasksStore', () => {
  beforeEach(() => {
    resetTasks();
  });

  describe('addRandomTask', () => {
    it('appends a task stamped with the current time', () => {
      jest.useFakeTimers({ now: new Date('2026-08-13T15:25:00.000Z') });

      const task = addRandomTask();

      expect(task.createdAt).toBe('2026-08-13T15:25:00.000Z');
      expect(listTasks()).toHaveLength(SEED_TASK_COUNT + 1);
      expect(listTasks().at(-1)).toBe(task);

      jest.useRealTimers();
    });

    it('gives each added task a fresh id above every seeded one', () => {
      const first = addRandomTask();
      const second = addRandomTask();

      expect(first.id).toBe('21');
      expect(second.id).toBe('22');
      expect(findTask('21')).toBe(first);
    });

    it('only uses service types and statuses the dashboard knows about', () => {
      const task = addRandomTask();

      expect(Object.values(SERVICE_TYPE)).toContain(task.serviceType);
      expect(Object.values(TASK_STATUS)).toContain(task.status);
      expect(task.customerName).toBeTruthy();
      expect(task.symptom).toBeTruthy();
    });
  });

  describe('listTasks filtering', () => {
    it('returns every task when no query params are given', () => {
      expect(listTasks()).toHaveLength(SEED_TASK_COUNT);
    });

    it('matches customer name case-insensitively as a partial match', () => {
      const result = listTasks({ customerName_like: 'anong' });

      expect(result.map((task) => task.id)).toEqual(['2']);
    });

    it('filters by exact service type', () => {
      const result = listTasks({ serviceType: SERVICE_TYPE.CHAT });

      expect(result.every((task) => task.serviceType === SERVICE_TYPE.CHAT)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThan(SEED_TASK_COUNT);
    });

    it('filters by exact status', () => {
      const result = listTasks({ status: TASK_STATUS.COMPLETED });

      expect(result.every((task) => task.status === TASK_STATUS.COMPLETED)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('filters by a createdAt date range', () => {
      const result = listTasks({
        createdAt_gte: '2026-06-30T00:00:00.000Z',
        createdAt_lte: '2026-06-30T23:59:59.999Z',
      });

      expect(result.every((task) => String(task.createdAt).startsWith('2026-06-30'))).toBe(true);
      expect(result.some((task) => task.id === '3')).toBe(false);
    });

    it('combines every filter with AND semantics', () => {
      const result = listTasks({
        customerName_like: 'Somchai',
        serviceType: SERVICE_TYPE.VIDEO_CALL,
        status: TASK_STATUS.NEW,
      });

      expect(result.map((task) => task.id)).toEqual(['1']);
    });
  });

  describe('resetTasks', () => {
    it('drops added tasks and restores the seeded list', () => {
      addRandomTask();

      expect(resetTasks()).toHaveLength(SEED_TASK_COUNT);
      expect(findTask('21')).toBeUndefined();
    });

    it('rolls back patched tasks to their db.json values', () => {
      patchTask('1', { status: TASK_STATUS.COMPLETED });
      expect(findTask('1')?.status).toBe(TASK_STATUS.COMPLETED);

      resetTasks();

      expect(findTask('1')?.status).toBe(db.tasks[0].status);
    });
  });
});
