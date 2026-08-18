'use client';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  alpha,
  Box,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { KeyboardEvent } from 'react';

import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

import { taskListHeight, taskListTableMinWidth } from '../constants/taskList';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import { ServiceTypeIcon } from './ServiceTypeIcon';
import { StatusChip } from './StatusChip';

const DATA_ISSUE_REMARK = 'Some data invalid';

const COLUMN_MIN_WIDTH = {
  customer: 28,
  service: 18,
  symptom: 45,
  requested: 20,
  status: 16,
};

type TTaskListColumn = keyof typeof COLUMN_MIN_WIDTH;

interface ITaskListCellProps {
  column: TTaskListColumn;
}

interface ITaskListRowProps {
  striped: boolean;
}

const Root = styled(Box)({
  position: 'relative',
});

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  height: taskListHeight,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
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

const StyledTable = styled(Table)({
  tableLayout: 'fixed',
  minWidth: taskListTableMinWidth,
});

const TaskListRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'striped',
})<ITaskListRowProps>(({ theme, striped }) => ({
  backgroundColor: striped ? theme.palette.action.hover : theme.palette.background.paper,
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.palette.action.selected },
  '&:focus-visible': { backgroundColor: theme.palette.action.selected, outline: 'none' },
}));

const TaskListCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'column',
})<ITaskListCellProps>(({ theme, column }) => ({
  minWidth: theme.spacing(COLUMN_MIN_WIDTH[column]),
}));

const RemarkLabel = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  color: theme.palette.warning.dark,
}));

const ServiceMeta = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  color: theme.palette.text.secondary,
}));

interface ITaskListProps {
  taskList: ITransformTaskItemResponse[];
  onSelectTask: (id: string) => void;
  isRefreshing?: boolean;
}

const TaskList = ({ taskList, onSelectTask, isRefreshing = false }: ITaskListProps) => {
  const renderRow = (task: ITransformTaskItemResponse, index: number) => {
    const handleSelect = () => onSelectTask(task.id);
    const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSelect();
      }
    };
    const hasDataIssue = task.issues.length > 0;

    return (
      <TaskListRow
        key={`${task.id}-${index}`}
        role="button"
        tabIndex={0}
        aria-label={`Request from ${task.displayCustomerName}`}
        striped={index % 2 === 1}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
      >
        <TaskListCell column="customer">
          <Typography variant="body2">{task.displayCustomerName}</Typography>
          {hasDataIssue && (
            <RemarkLabel direction="row" spacing={0.5}>
              <WarningAmberIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{DATA_ISSUE_REMARK}</Typography>
            </RemarkLabel>
          )}
        </TaskListCell>
        <TaskListCell column="service">
          <ServiceMeta direction="row" spacing={0.5}>
            <ServiceTypeIcon serviceType={task.serviceType ?? ''} />
            <Typography variant="body2">{task.displayServiceType}</Typography>
          </ServiceMeta>
        </TaskListCell>
        <TaskListCell column="symptom">
          <Typography variant="body2">{task.displaySymptom}</Typography>
        </TaskListCell>
        <TaskListCell column="requested">
          <Typography variant="body2" color="text.secondary">
            {task.displayCreatedAt}
          </Typography>
        </TaskListCell>
        <TaskListCell column="status" align="center">
          <StatusChip label={task.displayStatus} color={task.displayStatusColor} />
        </TaskListCell>
      </TaskListRow>
    );
  };

  return (
    <Root>
      <StyledTableContainer>
        <StyledTable stickyHeader>
          <TableHead>
            <TableRow>
              <TaskListCell column="customer">Customer</TaskListCell>
              <TaskListCell column="service">Service</TaskListCell>
              <TaskListCell column="symptom">Symptom</TaskListCell>
              <TaskListCell column="requested">Requested</TaskListCell>
              <TaskListCell column="status" align="center">
                Status
              </TaskListCell>
            </TableRow>
          </TableHead>
          <TableBody>{taskList.map(renderRow)}</TableBody>
        </StyledTable>
      </StyledTableContainer>
      {isRefreshing && (
        <RefreshOverlay aria-live="polite" aria-label="Refreshing task list">
          <LoadingSpinner size={32} />
        </RefreshOverlay>
      )}
    </Root>
  );
};

export default TaskList;
