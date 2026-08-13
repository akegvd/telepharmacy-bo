import { getLocalStorageItem, setLocalStorageItem } from '@/shared/utils/localStorage';

import { TTaskListViewMode } from '../types/taskListViewMode';

const TASK_LIST_VIEW_MODE_STORAGE_KEY = 'dashboard:taskListViewMode';

export const DEFAULT_TASK_LIST_VIEW_MODE: TTaskListViewMode = 'table';

const VALID_VIEW_MODES: TTaskListViewMode[] = ['table', 'grid'];

export const getTaskListViewMode = (): TTaskListViewMode => {
  const stored = getLocalStorageItem<TTaskListViewMode>(TASK_LIST_VIEW_MODE_STORAGE_KEY, DEFAULT_TASK_LIST_VIEW_MODE);

  return VALID_VIEW_MODES.includes(stored) ? stored : DEFAULT_TASK_LIST_VIEW_MODE;
};

export const setTaskListViewMode = (viewMode: TTaskListViewMode): void => {
  setLocalStorageItem(TASK_LIST_VIEW_MODE_STORAGE_KEY, viewMode);
};
