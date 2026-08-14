'use client';

import { useCallback, useState } from 'react';

import { useToast } from '@/shared/hooks/useToast';

import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import { useUpdateTaskStatusMutation } from './useUpdateTaskStatusMutation';

export const useAdvanceTaskStatus = (task: ITransformTaskItemResponse) => {
  const mutation = useUpdateTaskStatusMutation();
  const { showToast } = useToast();
  const nextStatus = task.nextStatus;
  const [isConfirmingAdvance, setIsConfirmingAdvance] = useState(false);

  const handleConfirmAdvance = useCallback(() => {
    if (!nextStatus) {
      return;
    }

    const nextStatusLabel = task.displayNextStatus;
    mutation.mutate(
      { id: task.id, status: nextStatus },
      {
        onSuccess: () => {
          setIsConfirmingAdvance(false);
          showToast(`Advanced to ${nextStatusLabel}.`, { variant: 'success' });
        },
        onError: () => {
          setIsConfirmingAdvance(false);
          showToast("Couldn't update the status. Please try again.", { variant: 'error' });
        },
      }
    );
  }, [mutation, nextStatus, showToast, task.displayNextStatus, task.id]);

  const handleAdvanceClick = useCallback(() => {
    setIsConfirmingAdvance(true);
  }, []);

  const handleCancelAdvance = useCallback(() => {
    setIsConfirmingAdvance(false);
  }, []);

  return {
    nextStatus,
    isConfirmingAdvance,
    isPending: mutation.isPending,
    handleAdvanceClick,
    handleConfirmAdvance,
    handleCancelAdvance,
  };
};
