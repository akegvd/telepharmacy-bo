'use client';

import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';

import TASK_STATUS from '@/shared/enums/api/tasks/status';

import DATA_ISSUE from '../enums/dataIssue';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import { TaskSummary } from './TaskSummary';

interface ITaskCardProps {
  task: ITransformTaskItemResponse;
  onAdvance: (task: ITransformTaskItemResponse) => void;
}

export const TaskCard = ({ task, onAdvance }: ITaskCardProps) => {
  const nextStatus = task.nextStatus;

  const handleAdvanceClick = () => {
    onAdvance(task);
  };

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
    </Card>
  );
};
