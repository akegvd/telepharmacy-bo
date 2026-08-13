'use client';

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { memo, useCallback, useMemo, useState } from 'react';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';

import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { useUpdateTaskStatusMutation } from '@/shared/hooks/api/tasks/useUpdateTaskStatusMutation';

import { mapDisplayStatusColorByStatus } from '../constants/mapDisplayStatusColorByStatus';
import { mapDisplayStatusLabelByStatus } from '../constants/mapDisplayStatusLabelByStatus';
import { taskListHeight, taskListTableMinWidth } from '../constants/taskList';
import { ITransformTask } from '../types/utils/transforms/transformTask';
import { formatTaskDate, getNextStatus } from '../utils/taskDisplay';

import { ServiceTypeIcon } from './ServiceTypeIcon';
import { StatusChip } from './StatusChip';

const ISSUE_LABELS: Record<string, string> = {
  missing_name: 'Customer name was missing',
  unknown_service_type: 'Unrecognized service type (showing raw value)',
  unknown_status: 'Unrecognized status (workflow disabled)',
  missing_symptom: 'Symptom description was missing',
  invalid_date: 'Request date missing or invalid',
};

const TASK_LIST_COLUMN_COUNT = 6;

type TTaskListRow =
  | { kind: 'task'; task: ITransformTask; rowGroupIndex: number }
  | { kind: 'issues'; taskId: string; label: string; rowGroupIndex: number };

const buildTaskListRows = (taskList: ITransformTask[]): TTaskListRow[] => {
  return taskList.flatMap((task, rowGroupIndex) => {
    if (task.issues.length === 0) {
      return [{ kind: 'task', task, rowGroupIndex }];
    }

    return [
      { kind: 'task', task, rowGroupIndex },
      {
        kind: 'issues',
        taskId: task.id,
        rowGroupIndex,
        label: task.issues.map((issue) => ISSUE_LABELS[issue] ?? issue).join(' · '),
      },
    ];
  });
};

const components: TableComponents<TTaskListRow> = {
  Table: (props) => <Table stickyHeader sx={{ tableLayout: 'fixed', minWidth: taskListTableMinWidth }} {...props} />,
  TableHead,
  TableBody,
  TableRow: ({ item, ...props }) => (
    <TableRow
      aria-label={item.kind === 'task' ? `Request from ${item.task.displayCustomerName}` : undefined}
      sx={{ bgcolor: item.rowGroupIndex % 2 === 1 ? 'action.hover' : 'background.paper' }}
      {...props}
    />
  ),
};

const fixedHeaderContent = () => (
  <TableRow>
    <TableCell sx={{ minWidth: (theme) => theme.spacing(28) }}>Customer</TableCell>
    <TableCell sx={{ minWidth: (theme) => theme.spacing(18) }}>Service</TableCell>
    <TableCell sx={{ minWidth: (theme) => theme.spacing(45) }}>Symptom</TableCell>
    <TableCell sx={{ minWidth: (theme) => theme.spacing(20) }}>Requested</TableCell>
    <TableCell sx={{ minWidth: (theme) => theme.spacing(16) }} align="center">
      Status
    </TableCell>
    <TableCell sx={{ minWidth: (theme) => theme.spacing(24) }} align="right">
      Action
    </TableCell>
  </TableRow>
);

interface IPendingAdvance {
  id: string;
  customerName: string;
  status: TASK_STATUS;
}

const TaskList = ({ taskList, onSelectTask }: { taskList: ITransformTask[]; onSelectTask: (id: string) => void }) => {
  const mutation = useUpdateTaskStatusMutation();
  const [pendingAdvance, setPendingAdvance] = useState<IPendingAdvance | null>(null);

  const rows = useMemo(() => buildTaskListRows(taskList), [taskList]);

  const itemContent = useCallback(
    (_index: number, row: TTaskListRow) => {
      if (row.kind === 'issues') {
        return (
          <TableCell colSpan={TASK_LIST_COLUMN_COUNT} sx={{ py: 0.5, borderBottom: 'none' }}>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', color: 'warning.dark' }}>
              <WarningAmberIcon fontSize="small" />
              <Typography variant="caption">{row.label}</Typography>
            </Stack>
          </TableCell>
        );
      }

      const { task } = row;
      const nextStatus = getNextStatus(task.status);

      return (
        <>
          <TableCell sx={{ minWidth: (theme) => theme.spacing(28) }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {task.displayCustomerName}
            </Typography>
          </TableCell>
          <TableCell sx={{ minWidth: (theme) => theme.spacing(18) }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <ServiceTypeIcon serviceType={task.serviceType} />
              <Typography variant="body2">{task.displayServiceType}</Typography>
            </Stack>
          </TableCell>
          <TableCell sx={{ minWidth: (theme) => theme.spacing(45) }}>
            <Typography variant="body2">{task.displaySymptom ? `“${task.displaySymptom}”` : ''}</Typography>
          </TableCell>
          <TableCell sx={{ minWidth: (theme) => theme.spacing(20) }}>
            <Typography variant="body2" color="text.secondary">
              {formatTaskDate(task.displayCreatedAt)}
            </Typography>
          </TableCell>
          <TableCell sx={{ minWidth: (theme) => theme.spacing(16) }} align="center">
            <StatusChip status={task.status} />
          </TableCell>
          <TableCell sx={{ minWidth: (theme) => theme.spacing(24) }} align="right">
            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
              {nextStatus && (
                <Tooltip title={`Advance to ${mapDisplayStatusLabelByStatus[nextStatus]}`}>
                  <IconButton
                    size="small"
                    aria-label="Advance"
                    color={mapDisplayStatusColorByStatus[nextStatus]}
                    onClick={() =>
                      setPendingAdvance({ id: task.id, customerName: task.displayCustomerName, status: nextStatus })
                    }
                  >
                    <EditDocumentIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="View detail">
                <IconButton size="small" aria-label="View detail" onClick={() => onSelectTask(task.id)}>
                  <DescriptionOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </TableCell>
        </>
      );
    },
    [onSelectTask]
  );

  return (
    <>
      <TableVirtuoso
        style={{ height: taskListHeight }}
        data={rows}
        components={components}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={itemContent}
      />
      <ConfirmDialog
        open={pendingAdvance !== null}
        title={
          pendingAdvance
            ? `Advance ${pendingAdvance.customerName}'s request to ${mapDisplayStatusLabelByStatus[pendingAdvance.status]}?`
            : ''
        }
        confirmLabel="Confirm"
        loading={mutation.isPending}
        onCancel={() => setPendingAdvance(null)}
        onConfirm={() => {
          if (!pendingAdvance) {
            return;
          }
          mutation.mutate(
            { id: pendingAdvance.id, status: pendingAdvance.status },
            { onSuccess: () => setPendingAdvance(null) }
          );
        }}
      />
    </>
  );
};

export default memo(TaskList);
