'use client';

import { useCallback } from 'react';

import { useToast } from '@/shared/hooks/useToast';

import useCreateRandomTask from './useCreateRandomTask';
import useResetTaskList from './useResetTaskList';

/**
 * Deliberately leaves the task list cache untouched. Invalidating here would pull the change
 * in immediately and hide whether the dashboard's auto-refresh poll picked it up on its own,
 * which is exactly what these controls exist to exercise.
 */
export const useDevTaskApiControls = () => {
  const { showToast } = useToast();

  const handleError = useCallback(
    (error: unknown) => {
      showToast(error instanceof Error ? error.message : 'The dev API action failed.', { variant: 'error' });
    },
    [showToast]
  );

  const addRandomTaskMutation = useCreateRandomTask({
    onSuccess: () => showToast('Random task added — waiting for the next refresh.', { variant: 'success' }),
    onError: handleError,
  });

  const resetTaskListMutation = useResetTaskList({
    onSuccess: () => showToast('Tasks reset from db.json — waiting for the next refresh.', { variant: 'success' }),
    onError: handleError,
  });

  return { addRandomTaskMutation, resetTaskListMutation };
};
