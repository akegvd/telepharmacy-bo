'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';
import { useToast } from '@/shared/hooks/useToast';

import useCreateRandomTask from './useCreateRandomTask';
import useResetTaskList from './useResetTaskList';

export const useDevTaskApiControls = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const handleSuccess = useCallback(
    (message: string) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all });
      showToast(message, { variant: 'success' });
    },
    [queryClient, showToast]
  );

  const handleError = useCallback(
    (error: unknown) => {
      showToast(error instanceof Error ? error.message : 'The dev API action failed.', { variant: 'error' });
    },
    [showToast]
  );

  const addRandomTaskMutation = useCreateRandomTask({
    onSuccess: () => handleSuccess('Random task added.'),
    onError: handleError,
  });

  const resetTaskListMutation = useResetTaskList({
    onSuccess: () => handleSuccess('Tasks reset from db.json.'),
    onError: handleError,
  });

  return { addRandomTaskMutation, resetTaskListMutation };
};
