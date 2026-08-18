'use client';

import { Alert, Box, Container, Divider, Paper, Stack, styled, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Modal } from '@/shared/components/Modal';
import { SearchResultWrapper } from '@/shared/components/SearchResultWrapper';

import { taskListAutoRefreshIntervalMs } from '../constants/taskList';
import { useTaskListQuery } from '../hooks/useTaskListQuery';
import { useTaskListViewMode } from '../hooks/useTaskListViewMode';

import { AutoRefreshControl } from './AutoRefreshControl';
import FilterBar from './FilterBar';
import { SummaryBar } from './SummaryBar';
import { TaskDetailContent } from './TaskDetailContent';
import TaskGrid from './TaskGrid';
import TaskList from './TaskList';
import { TaskListViewToggle } from './TaskListViewToggle';

const ToolbarRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

const ControlsPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: theme.spacing(1, 1.5),
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
    padding: theme.spacing(0.75, 1.75),
  },
}));

const ControlsGroup = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'flex-start',
  },
}));

const Dashboard = () => {
  const { replace, push } = useRouter();
  const searchParams = useSearchParams();
  const [isAutoRefreshPaused, setIsAutoRefreshPaused] = useState(false);
  const [viewMode, setViewMode] = useTaskListViewMode();

  const customerName = searchParams.get('customerName') ?? '';
  const service = searchParams.get('service') ?? 'all';
  const status = searchParams.get('status') ?? 'all';
  const createdFrom = searchParams.get('createdFrom') ?? '';
  const createdTo = searchParams.get('createdTo') ?? '';
  const hasActiveFilters =
    customerName !== '' || service !== 'all' || status !== 'all' || createdFrom !== '' || createdTo !== '';
  const filters = { customerName, serviceType: service, status, createdFrom, createdTo };

  const { data, isLoading, isError, error, refetch, isRefetching, dataUpdatedAt } = useTaskListQuery({
    isAutoRefreshEnabled: !isAutoRefreshPaused,
    filters,
  });

  const taskId = searchParams.get('taskId');
  const taskFromUrl = data?.taskList.find((item) => item.id === taskId) ?? null;

  // The dialog's own open state is decoupled from `taskId` so closing can play its
  // exit transition before the param (and the taskFromUrl content behind it) is cleared.
  // Initialized from taskId to support opening straight from a deep link.
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(!!taskId);

  const updateParam = (key: string, value: string, emptyValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === emptyValue) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    replace(`/?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (value: string) => updateParam('customerName', value, '');

  const handleServiceChange = (value: string) => updateParam('service', value, 'all');

  const handleStatusChange = (value: string) => updateParam('status', value, 'all');

  const handleCreatedFromChange = (value: string) => updateParam('createdFrom', value, '');

  const handleCreatedToChange = (value: string) => updateParam('createdTo', value, '');

  const handleSelectTask = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('taskId', id);
    push(`/?${params.toString()}`, { scroll: false });
    setIsTaskDetailOpen(true);
  };

  const handleTaskDetailClose = () => {
    setIsTaskDetailOpen(false);
  };

  const handleTaskDetailExited = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('taskId');
    push(`/?${params.toString()}`, { scroll: false });
  };

  const handleTogglePause = () => {
    const isResuming = isAutoRefreshPaused;
    setIsAutoRefreshPaused(!isResuming);
    // Resuming re-arms react-query's poll timer starting from now, not from the last
    // fetch — refetch immediately so the displayed countdown stays anchored to it.
    if (isResuming) {
      refetch();
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const handleRefreshNow = () => {
    refetch();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>

        <FilterBar
          search={customerName}
          service={service}
          status={status}
          createdFrom={createdFrom}
          createdTo={createdTo}
          onSearchChange={handleSearchChange}
          onServiceChange={handleServiceChange}
          onStatusChange={handleStatusChange}
          onCreatedFromChange={handleCreatedFromChange}
          onCreatedToChange={handleCreatedToChange}
        />

        <SearchResultWrapper
          isLoading={isLoading}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : 'Something went wrong loading tasks.'}
          onRetry={handleRetry}
        >
          {data && (
            <Stack spacing={1.5}>
              <ToolbarRow>
                <SummaryBar summary={data.summary} />
                <ControlsPaper variant="outlined">
                  <ControlsGroup direction="row" spacing={1.5} divider={<Divider orientation="vertical" flexItem />}>
                    <AutoRefreshControl
                      isPaused={isAutoRefreshPaused}
                      isRefreshing={isRefetching}
                      dataUpdatedAt={dataUpdatedAt}
                      intervalMs={taskListAutoRefreshIntervalMs}
                      onTogglePause={handleTogglePause}
                      onRefreshNow={handleRefreshNow}
                    />
                    <TaskListViewToggle value={viewMode} onChange={setViewMode} />
                  </ControlsGroup>
                </ControlsPaper>
              </ToolbarRow>

              {data.taskList.length === 0 ? (
                <Alert severity="info" variant="outlined">
                  {hasActiveFilters ? 'No requests match your filters.' : 'No consultation requests yet.'}
                </Alert>
              ) : viewMode === 'grid' ? (
                <TaskGrid taskList={data.taskList} isRefreshing={isRefetching} />
              ) : (
                <TaskList taskList={data.taskList} onSelectTask={handleSelectTask} isRefreshing={isRefetching} />
              )}
            </Stack>
          )}
        </SearchResultWrapper>
      </Stack>

      <Modal open={isTaskDetailOpen} onClose={handleTaskDetailClose} onExited={handleTaskDetailExited}>
        {taskFromUrl && <TaskDetailContent task={taskFromUrl} />}
      </Modal>
    </Container>
  );
};

export default Dashboard;
