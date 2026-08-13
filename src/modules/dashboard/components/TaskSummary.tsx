'use client';

import { Alert, Divider, Stack, styled, Typography } from '@mui/material';

import { mapDataIssueLabelByDataIssue } from '../constants/mapDataIssueLabelByDataIssue';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import { ServiceTypeIcon } from './ServiceTypeIcon';
import { StatusChip } from './StatusChip';

interface ITaskSummaryProps {
  task: ITransformTaskItemResponse;
  dense?: boolean;
}

const FieldLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const TaskSummary = ({ task, dense = false }: ITaskSummaryProps) => {
  return (
    <Stack spacing={dense ? 1.25 : 2}>
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant={dense ? 'subtitle1' : 'h5'} color="text.primary">
          {task.displayCustomerName}
        </Typography>
        <StatusChip label={task.displayStatus} color={task.displayStatusColor} />
      </Stack>

      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <ServiceTypeIcon serviceType={task.serviceType ?? ''} sx={{ color: 'text.secondary' }} />
        <Typography variant="body2" color="text.secondary">
          {task.displayServiceType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ·
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {task.displayCreatedAt}
        </Typography>
      </Stack>

      {!dense && <Divider />}

      <Stack spacing={0.5}>
        <FieldLabel variant="overline">Reason for consultation</FieldLabel>
        <Typography variant={dense ? 'body2' : 'body1'} color="text.primary">
          {task.displaySymptom}
        </Typography>
      </Stack>

      {task.issues.length > 0 && (
        <Alert severity="warning" variant="outlined">
          <Stack spacing={0.5}>
            {task.issues.map((issue) => (
              <Typography key={issue} variant="body2">
                {mapDataIssueLabelByDataIssue[issue] ?? issue}
              </Typography>
            ))}
          </Stack>
        </Alert>
      )}
    </Stack>
  );
};
