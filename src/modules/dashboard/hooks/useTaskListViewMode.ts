'use client';

import { useCallback, useEffect, useState } from 'react';

import { TTaskListViewMode } from '../types/taskListViewMode';
import { DEFAULT_TASK_LIST_VIEW_MODE, getTaskListViewMode, setTaskListViewMode } from '../utils/taskListViewMode';

export const useTaskListViewMode = () => {
  const [viewMode, setViewModeState] = useState<TTaskListViewMode>(DEFAULT_TASK_LIST_VIEW_MODE);

  // Read localStorage after mount (not in the initializer) so the client's first render
  // matches the server's SSR-only default and avoids a hydration mismatch.
  useEffect(() => {
    setViewModeState(getTaskListViewMode());
  }, []);

  const setViewMode = useCallback((mode: TTaskListViewMode) => {
    setViewModeState(mode);
    setTaskListViewMode(mode);
  }, []);

  return [viewMode, setViewMode] as const;
};
