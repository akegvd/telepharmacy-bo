'use client';

import { Alert, Box, Container, Divider, Paper, Stack, styled, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Modal } from '@/shared/components/Modal';
import { SearchResultWrapper } from '@/shared/components/SearchResultWrapper';

import { taskListAutoRefreshIntervalMs } from '../constants/taskList';
import { useTaskListQuery } from '../hooks/useTaskListQuery';
import { useTaskListViewMode } from '../hooks/useTaskListViewMode';
import { filterTaskList } from '../utils/filterTaskList';

import { AutoRefreshControl } from './AutoRefreshControl';
import { FilterBar } from './FilterBar';
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

const SEARCH_DEBOUNCE_MS = 300;

const Dashboard = () => {
  const { replace, push } = useRouter();
  const searchParams = useSearchParams();
  const [isAutoRefreshPaused, setIsAutoRefreshPaused] = useState(false);
  const [viewMode, setViewMode] = useTaskListViewMode();
  const { data, isLoading, isError, error, refetch, isRefetching, dataUpdatedAt } = useTaskListQuery({
    isAutoRefreshEnabled: !isAutoRefreshPaused,
  });

  const q = searchParams.get('q') ?? '';
  const service = searchParams.get('service') ?? 'all';
  const status = searchParams.get('status') ?? 'all';
  const [searchInput, setSearchInput] = useState(q);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const taskId = searchParams.get('taskId');
  const taskFromUrl = useMemo(() => data?.taskList.find((item) => item.id === taskId) ?? null, [data, taskId]);

  // The dialog's own open state is decoupled from `taskId` so closing can play its
  // exit transition before the param (and the taskFromUrl content behind it) is cleared.
  // Initialized from taskId to support opening straight from a deep link.
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(!!taskId);

  const filteredTaskList = useMemo(
    () => (data ? filterTaskList(data.taskList, { q, service, status }) : []),
    [data, q, service, status]
  );

  const updateParam = useCallback(
    (key: string, value: string, emptyValue: string) => {
      const params = new URLSearchParams(searchParams);
      if (value === emptyValue) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      replace(`/?${params.toString()}`, { scroll: false });
    },
    [replace, searchParams]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
      searchDebounceRef.current = setTimeout(() => {
        updateParam('q', value, '');
      }, SEARCH_DEBOUNCE_MS);
    },
    [updateParam]
  );

  const handleServiceChange = useCallback((value: string) => updateParam('service', value, 'all'), [updateParam]);

  const handleStatusChange = useCallback((value: string) => updateParam('status', value, 'all'), [updateParam]);

  const handleSelectTask = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('taskId', id);
      push(`/?${params.toString()}`, { scroll: false });
      setIsTaskDetailOpen(true);
    },
    [push, searchParams]
  );

  const handleTaskDetailClose = useCallback(() => {
    setIsTaskDetailOpen(false);
  }, []);

  const handleTaskDetailExited = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('taskId');
    push(`/?${params.toString()}`, { scroll: false });
  }, [push, searchParams]);

  const handleTogglePause = useCallback(() => {
    const isResuming = isAutoRefreshPaused;
    setIsAutoRefreshPaused(!isResuming);
    // Resuming re-arms react-query's poll timer starting from now, not from the last
    // fetch — refetch immediately so the displayed countdown stays anchored to it.
    if (isResuming) {
      refetch();
    }
  }, [isAutoRefreshPaused, refetch]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleRefreshNow = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>

        <FilterBar
          search={searchInput}
          service={service}
          status={status}
          onSearchChange={handleSearchChange}
          onServiceChange={handleServiceChange}
          onStatusChange={handleStatusChange}
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

              {filteredTaskList.length === 0 ? (
                <Alert severity="info" variant="outlined">
                  {data.taskList.length === 0 ? 'No consultation requests yet.' : 'No requests match your filters.'}
                </Alert>
              ) : viewMode === 'grid' ? (
                <TaskGrid taskList={filteredTaskList} isRefreshing={isRefetching} />
              ) : (
                <TaskList taskList={filteredTaskList} onSelectTask={handleSelectTask} isRefreshing={isRefetching} />
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
