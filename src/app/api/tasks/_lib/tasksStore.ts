import db from '../../../../../db.json';

import { createRandomTaskRecord } from './randomTask';
import { ITaskRecord } from './taskRecord';

/** Mirrors the shared ITaskListRequestParams contract — json-server style query params. */
export interface ITaskListQueryParams {
  customerName_like?: string;
  serviceType?: string;
  status?: string;
  createdAt_gte?: string;
  createdAt_lte?: string;
}

const createSeedTaskList = (): ITaskRecord[] => {
  return (db.tasks as ITaskRecord[]).map((task) => ({ ...task }));
};

/** Module-scope so a warm serverless instance sees its own patches; deliberately not persisted. */
let taskList: ITaskRecord[] = createSeedTaskList();

const matchesQuery = (task: ITaskRecord, query: ITaskListQueryParams): boolean => {
  if (query.customerName_like) {
    const customerName = typeof task.customerName === 'string' ? task.customerName : '';
    if (!customerName.toLowerCase().includes(query.customerName_like.toLowerCase())) {
      return false;
    }
  }

  if (query.serviceType && task.serviceType !== query.serviceType) {
    return false;
  }

  if (query.status && task.status !== query.status) {
    return false;
  }

  const createdAt = typeof task.createdAt === 'string' ? task.createdAt : '';

  if (query.createdAt_gte && createdAt < query.createdAt_gte) {
    return false;
  }

  if (query.createdAt_lte && createdAt > query.createdAt_lte) {
    return false;
  }

  return true;
};

export const listTasks = (query: ITaskListQueryParams = {}): ITaskRecord[] => {
  return taskList.filter((task) => matchesQuery(task, query));
};

export const findTask = (id: string): ITaskRecord | undefined => {
  return taskList.find((task) => String(task.id) === id);
};

export const patchTask = (id: string, patch: Record<string, unknown>): ITaskRecord | undefined => {
  const index = taskList.findIndex((task) => String(task.id) === id);
  if (index === -1) {
    return undefined;
  }

  taskList[index] = { ...taskList[index], ...patch, id: taskList[index].id };

  return taskList[index];
};

/** db.json has a duplicate id, so derive from the highest numeric one rather than the list length. */
const getNextTaskId = (): string => {
  const highestNumericId = taskList.reduce((highest, task) => {
    const numericId = Number(task.id);

    return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest;
  }, 0);

  return String(highestNumericId + 1);
};

export const addRandomTask = (): ITaskRecord => {
  const task = createRandomTaskRecord(getNextTaskId());
  taskList.push(task);

  return task;
};

export const resetTasks = (): ITaskRecord[] => {
  taskList = createSeedTaskList();

  return taskList;
};
