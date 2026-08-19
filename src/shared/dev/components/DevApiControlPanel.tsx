'use client';

import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Button, Chip, Collapse, Divider, IconButton, Paper, Stack, styled, Typography } from '@mui/material';
import { useIsFetching } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { apiBaseUrl } from '@/shared/constants/api';
import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';

import { useCachedTaskListCount } from '../hooks/useCachedTaskListCount';
import { useDevTaskApiControls } from '../hooks/useDevTaskApiControls';

const Root = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  right: theme.spacing(2),
  bottom: theme.spacing(2),
  // Above the app bar and sidebar, but below the task detail modal.
  zIndex: theme.zIndex.drawer + 2,
  width: 260,
  padding: theme.spacing(1, 1.5, 1.25),
}));

const HeaderRow = styled(Stack)({
  alignItems: 'center',
  justifyContent: 'space-between',
});

const StateRow = styled(Stack)({
  alignItems: 'baseline',
  justifyContent: 'space-between',
});

interface IApiStateRowProps {
  label: string;
  value: string;
}

const ApiStateRow = ({ label, value }: IApiStateRowProps) => {
  return (
    <StateRow direction="row" spacing={1}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="caption" noWrap title={value} sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </StateRow>
  );
};

export const DevApiControlPanelContent = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const cachedTaskCount = useCachedTaskListCount();
  const fetchingCount = useIsFetching({ queryKey: taskKeys.all });
  const { addRandomTaskMutation, resetTaskListMutation } = useDevTaskApiControls();

  const isBusy = addRandomTaskMutation.isPending || resetTaskListMutation.isPending;

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((expanded) => !expanded);
  }, []);

  const handleAddRandomTask = useCallback(() => {
    addRandomTaskMutation.mutate();
  }, [addRandomTaskMutation]);

  const handleResetTaskList = useCallback(() => {
    resetTaskListMutation.mutate();
  }, [resetTaskListMutation]);

  return (
    <Root elevation={6}>
      <HeaderRow direction="row" spacing={1}>
        <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
          <Typography variant="subtitle2">Dev API</Typography>
          <Chip label="in-memory" size="small" color="warning" variant="outlined" />
        </Stack>

        <IconButton
          size="small"
          aria-label={isExpanded ? 'Collapse dev API panel' : 'Expand dev API panel'}
          onClick={handleToggleExpanded}
        >
          {isExpanded ? <ExpandMoreIcon fontSize="small" /> : <ExpandLessIcon fontSize="small" />}
        </IconButton>
      </HeaderRow>

      <Collapse in={isExpanded}>
        <Divider sx={{ my: 1 }} />

        <Stack spacing={0.25}>
          <ApiStateRow label="Base URL" value={apiBaseUrl} />
          <ApiStateRow label="Tasks in view" value={cachedTaskCount === null ? '—' : String(cachedTaskCount)} />
          <ApiStateRow label="Status" value={fetchingCount > 0 ? 'Syncing…' : 'Idle'} />
        </Stack>

        <Stack spacing={0.75} sx={{ mt: 1.25 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            disabled={isBusy}
            onClick={handleAddRandomTask}
          >
            Add random task
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<RestartAltIcon />}
            disabled={isBusy}
            onClick={handleResetTaskList}
          >
            Reset from db.json
          </Button>
        </Stack>
      </Collapse>
    </Root>
  );
};

const DevApiControlPanel = () => {
  if (process.env.NEXT_PUBLIC_ENABLE_DEV_API_CONTROLS !== 'true') {
    return null;
  }

  return <DevApiControlPanelContent />;
};

export default DevApiControlPanel;
