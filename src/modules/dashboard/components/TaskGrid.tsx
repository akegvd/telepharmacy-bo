import { alpha, Box, Stack, styled } from '@mui/material';

import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

import { taskListHeight } from '../constants/taskList';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import { TaskCard } from './TaskCard';

interface ITaskGridProps {
  taskList: ITransformTaskItemResponse[];
  onAdvanceTask: (task: ITransformTaskItemResponse) => void;
  isRefreshing?: boolean;
}

const Root = styled(Box)({
  position: 'relative',
});

const ScrollArea = styled(Box)(({ theme }) => ({
  height: taskListHeight,
  overflowY: 'auto',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
}));

const RefreshOverlay = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: theme.shape.borderRadius,
  pointerEvents: 'none',
}));

const TaskGrid = ({ taskList, onAdvanceTask, isRefreshing = false }: ITaskGridProps) => {
  return (
    <Root>
      <ScrollArea>
        <Stack spacing={1.5}>
          {taskList.map((task, index) => (
            <TaskCard key={`${task.id}-${index}`} task={task} onAdvance={onAdvanceTask} />
          ))}
        </Stack>
      </ScrollArea>
      {isRefreshing && (
        <RefreshOverlay aria-live="polite" aria-label="Refreshing task list">
          <LoadingSpinner size={32} />
        </RefreshOverlay>
      )}
    </Root>
  );
};

export default TaskGrid;
