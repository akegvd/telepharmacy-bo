import db from '../../../../../db.json';

export type TTaskRecord = Record<string, unknown> & { id: unknown };

/** Module-scope so a warm serverless instance sees its own patches; deliberately not persisted. */
const taskList: TTaskRecord[] = (db.tasks as TTaskRecord[]).map((task) => ({ ...task }));

export const listTasks = (): TTaskRecord[] => {
  return taskList;
};

export const findTask = (id: string): TTaskRecord | undefined => {
  return taskList.find((task) => String(task.id) === id);
};

export const patchTask = (id: string, patch: Record<string, unknown>): TTaskRecord | undefined => {
  const index = taskList.findIndex((task) => String(task.id) === id);
  if (index === -1) {
    return undefined;
  }

  taskList[index] = { ...taskList[index], ...patch, id: taskList[index].id };

  return taskList[index];
};
