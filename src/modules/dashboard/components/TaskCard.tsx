'use client';

import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';

import ConfirmDialog from '@/shared/components/ConfirmDialog';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import DATA_ISSUE from '../enums/dataIssue';
import { useAdvanceTaskStatus } from '../hooks/useAdvanceTaskStatus';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import { TaskSummary } from './TaskSummary';

interface ITaskCardProps {
  task: ITransformTaskItemResponse;
}

export const TaskCard = ({ task }: ITaskCardProps) => {
  const {
    nextStatus,
    isConfirmingAdvance,
    isPending,
    handleAdvanceClick,
    handleConfirmAdvance,
    handleCancelAdvance,
  } = useAdvanceTaskStatus(task);

  return (
    <Card variant="outlined">
      <CardContent>
        <TaskSummary task={task} dense />
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end' }}>
        {nextStatus ? (
          <Button size="small" variant="contained" onClick={handleAdvanceClick}>
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
      </CardActions>

      {nextStatus && (
        <ConfirmDialog
          open={isConfirmingAdvance}
          title={`Advance ${task.displayCustomerName}'s request to ${task.displayNextStatus}?`}
          confirmLabel="Confirm"
          loading={isPending}
          onCancel={handleCancelAdvance}
          onConfirm={handleConfirmAdvance}
        />
      )}
    </Card>
  );
};
