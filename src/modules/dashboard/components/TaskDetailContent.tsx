'use client';

import { Button, Stack, styled, Typography } from '@mui/material';
import { useCallback, useState } from 'react';

import ConfirmDialog from '@/shared/components/ConfirmDialog';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { useToast } from '@/shared/hooks/useToast';

import DATA_ISSUE from '../enums/dataIssue';
import { useUpdateTaskStatusMutation } from '../hooks/useUpdateTaskStatusMutation';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import TaskSummary from './TaskSummary';

interface ITaskDetailContentProps {
  task: ITransformTaskItemResponse;
}

const Footer = styled(Stack)({
  justifyContent: 'flex-end',
});

const TaskDetailContent = ({ task }: ITaskDetailContentProps) => {
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

  return (
    <Stack spacing={2}>
      <TaskSummary task={task} />

      <Footer direction="row">
        {nextStatus ? (
          <Button variant="contained" onClick={handleAdvanceClick}>
            Advance to {task.displayNextStatus}
          </Button>
        ) : task.issues.includes(DATA_ISSUE.UNKNOWN_STATUS) ? (
          <Typography variant="body2" color="text.secondary">
            Status not recognized — workflow actions are unavailable.
          </Typography>
        ) : task.status === TASK_STATUS.COMPLETED ? (
          <Typography variant="body2" color="text.secondary">
            This request has been completed.
          </Typography>
        ) : null}
      </Footer>

      {nextStatus && (
        <ConfirmDialog
          open={isConfirmingAdvance}
          title={`Advance ${task.displayCustomerName}'s request to ${task.displayNextStatus}?`}
          confirmLabel="Confirm"
          loading={mutation.isPending}
          onCancel={handleCancelAdvance}
          onConfirm={handleConfirmAdvance}
        />
      )}
    </Stack>
  );
};

export default TaskDetailContent;
