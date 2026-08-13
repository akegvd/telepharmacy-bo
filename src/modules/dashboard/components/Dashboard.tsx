'use client';

import { Alert, Box, Container, Stack, Typography } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import { Modal } from '@/shared/components/Modal';
import { SearchResultWrapper } from '@/shared/components/SearchResultWrapper';
import { useTaskListQuery } from '@/shared/hooks/api/tasks/useTaskListQuery';

import { filterTaskList } from '../utils/filterTaskList';

import { FilterBar } from './FilterBar';
import { SummaryBar } from './SummaryBar';
import { TaskDetailContent } from './TaskDetailContent';
import TaskList from './TaskList';

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading, isError, error, refetch, isRefetching } = useTaskListQuery();

  const filters = {
    q: searchParams.get('q') ?? '',
    service: searchParams.get('service') ?? 'all',
    status: searchParams.get('status') ?? 'all',
  };

  const selectedTaskId = searchParams.get('id');

  const filteredTaskList = useMemo(
    () => (data ? filterTaskList(data.taskList, filters) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filters.q, filters.service, filters.status]
  );

  const openTask = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('id', id);
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const closeTask = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('id');
    router.push(`/?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review incoming consultation requests and move them through the workflow.
            {isRefetching && ' · refreshing…'}
          </Typography>
        </Box>

        <FilterBar />

        <SearchResultWrapper
          isLoading={isLoading}
          isError={isError}
          errorMessage={error instanceof Error ? error.message : 'Something went wrong loading tasks.'}
          onRetry={() => refetch()}
        >
          {data && (
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SummaryBar summary={data.summary} />
              </Box>

              {filteredTaskList.length === 0 ? (
                <Alert severity="info" variant="outlined">
                  {data.taskList.length === 0 ? 'No consultation requests yet.' : 'No requests match your filters.'}
                </Alert>
              ) : (
                <TaskList taskList={filteredTaskList} onSelectTask={openTask} />
              )}
            </Stack>
          )}
        </SearchResultWrapper>
      </Stack>

      {selectedTaskId && (
        <Modal onClose={closeTask}>
          <TaskDetailContent id={selectedTaskId} />
        </Modal>
      )}
    </Container>
  );
};

export default Dashboard;
