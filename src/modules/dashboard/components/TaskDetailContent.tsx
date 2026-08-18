'use client';

import { Button, Stack, styled, Typography } from '@mui/material';

import TASK_STATUS from '@/shared/enums/api/tasks/status';

import DATA_ISSUE from '../enums/dataIssue';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import { TaskSummary } from './TaskSummary';

interface ITaskDetailContentProps {
  task: ITransformTaskItemResponse;
  onAdvance: (task: ITransformTaskItemResponse) => void;
}

const Footer = styled(Stack)({
  justifyContent: 'flex-end',
});

export const TaskDetailContent = ({ task, onAdvance }: ITaskDetailContentProps) => {
  const nextStatus = task.nextStatus;

  const handleAdvanceClick = () => {
    onAdvance(task);
  };

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
    </Stack>
  );
};
