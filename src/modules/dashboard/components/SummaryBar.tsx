import { Divider, Paper, Stack, Typography } from '@mui/material';

import { mapDisplayStatusLabelByStatus } from '../constants/mapDisplayStatusLabelByStatus';
import { taskStatusOptionList } from '../constants/taskStatusOptionList';
import { ITaskListSummary } from '../types/utils/transforms/transformTaskListResponse';

export const SummaryBar = ({ summary }: { summary: ITaskListSummary }) => {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, px: 2, display: 'inline-flex' }}>
      <Stack
        direction="row"
        spacing={3}
        divider={<Divider orientation="vertical" flexItem />}
        sx={{ flexWrap: 'wrap' }}
      >
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline' }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            {summary.total}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total
          </Typography>
        </Stack>
        {taskStatusOptionList.map((status) => (
          <Stack key={status} direction="row" spacing={0.75} sx={{ alignItems: 'baseline' }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
              {summary.statusCounts[status]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mapDisplayStatusLabelByStatus[status]}
            </Typography>
          </Stack>
        ))}
        {summary.flaggedCount > 0 && (
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'baseline' }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 700, color: 'warning.main' }}>
              {summary.flaggedCount}
            </Typography>
            <Typography variant="body2" color="warning.main">
              Flagged
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};
