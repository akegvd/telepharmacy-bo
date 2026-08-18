'use client';

import { useState } from 'react';

import { TTaskListViewMode } from '../types/taskListViewMode';
import { getTaskListViewMode, setTaskListViewMode } from '../utils/taskListViewMode';

export const useTaskListViewMode = () => {
  const [viewMode, setViewModeState] = useState<TTaskListViewMode>(getTaskListViewMode());

  const setViewMode = (mode: TTaskListViewMode) => {
    setViewModeState(mode);
    setTaskListViewMode(mode);
  };

  return [viewMode, setViewMode] as const;
};
