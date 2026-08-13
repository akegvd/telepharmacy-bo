import db from '../../../../../db.json';

export interface ITaskRecord {
  id: unknown;
  [key: string]: unknown;
}

/** Module-scope so a warm serverless instance sees its own patches; deliberately not persisted. */
const taskList: ITaskRecord[] = (db.tasks as ITaskRecord[]).map((task) => ({ ...task }));

export const listTasks = (): ITaskRecord[] => {
  return taskList;
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
