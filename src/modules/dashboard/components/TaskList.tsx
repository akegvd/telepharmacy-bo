'use client';

import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { TableComponents, TableVirtuoso } from 'react-virtuoso';

import { ITransformTask } from '../types/utils/transforms/transformTask';
import { formatTaskDate, SERVICE_TYPE_META } from '../utils/taskDisplay';

import { ServiceTypeIcon } from './ServiceTypeIcon';
import { StatusChip } from './StatusChip';

const ISSUE_LABELS: Record<string, string> = {
  missing_name: 'Customer name was missing',
  unknown_service_type: 'Unrecognized service type',
  unknown_status: 'Unrecognized status, shown as New',
  missing_symptom: 'Symptom description was missing',
  invalid_date: 'Requested date could not be parsed',
};

export function TaskList({ tasks }: { tasks: ITransformTask[] }) {
  const router = useRouter();

  const components: TableComponents<ITransformTask> = useMemo(
    () => ({
      Table: (props) => <Table stickyHeader sx={{ tableLayout: 'fixed', minWidth: 720 }} {...props} />,
      TableHead,
      TableBody,
      TableRow: ({ item, ...props }) => (
        <TableRow
          hover
          tabIndex={0}
          role="link"
          aria-label={`Open request from ${item.displayCustomerName}`}
          onClick={() => router.push(`/task/${item.id}`)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              router.push(`/task/${item.id}`);
            }
          }}
          sx={{ cursor: 'pointer' }}
          {...props}
        />
      ),
    }),
    [router]
  );

  return (
    <TableVirtuoso
      useWindowScroll
      data={tasks}
      components={components}
      fixedHeaderContent={() => (
        <TableRow>
          <TableCell width="28%">Customer</TableCell>
          <TableCell width="16%">Service</TableCell>
          <TableCell>Symptom</TableCell>
          <TableCell width="18%">Requested</TableCell>
          <TableCell width="14%" align="center">
            Status
          </TableCell>
        </TableRow>
      )}
      itemContent={(_index, task) => (
        <>
          <TableCell>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
                {task.displayCustomerName}
              </Typography>
              {task.issues.length > 0 && (
                <Tooltip title={task.issues.map((issue) => ISSUE_LABELS[issue] ?? issue).join(' · ')}>
                  <Box
                    data-testid="data-issue-warning"
                    sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}
                  >
                    <WarningAmberIcon fontSize="small" />
                  </Box>
                </Tooltip>
              )}
            </Stack>
          </TableCell>
          <TableCell>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <ServiceTypeIcon serviceType={task.displayServiceType} />
              <Typography variant="body2" noWrap>
                {SERVICE_TYPE_META[task.displayServiceType].label}
              </Typography>
            </Stack>
          </TableCell>
          <TableCell>
            <Tooltip title={task.displaySymptom}>
              <Typography variant="body2" noWrap>
                &ldquo;{task.displaySymptom}&rdquo;
              </Typography>
            </Tooltip>
          </TableCell>
          <TableCell>
            <Typography variant="body2" color="text.secondary" noWrap>
              {formatTaskDate(task.displayCreatedAt)}
            </Typography>
          </TableCell>
          <TableCell align="center">
            <StatusChip status={task.displayStatus} />
          </TableCell>
        </>
      )}
    />
  );
}
