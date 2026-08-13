import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { makeTask } from '../mocks/taskFixtures';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import TaskGrid from './TaskGrid';

const renderGrid = (taskList: ITransformTaskItemResponse[], isRefreshing = false) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TaskGrid taskList={taskList} isRefreshing={isRefreshing} />
    </QueryClientProvider>
  );
};

describe('TaskGrid', () => {
  it('renders a card for each task', () => {
    renderGrid([
      makeTask({ id: '1', customerName: 'Somchai P.' }),
      makeTask({ id: '2', customerName: 'Nutcha R.' }),
    ]);

    expect(screen.getByText('Somchai P.')).toBeInTheDocument();
    expect(screen.getByText('Nutcha R.')).toBeInTheDocument();
  });

  it('renders no cards when there are no tasks', () => {
    renderGrid([]);

    expect(screen.queryAllByRole('button', { name: /Advance to/ })).toHaveLength(0);
  });

  it('shows an advance action for a task with a next status', () => {
    renderGrid([makeTask({ id: '42', status: TASK_STATUS.NEW })]);

    expect(screen.getByRole('button', { name: 'Advance to In progress' })).toBeInTheDocument();
  });

  it('shows no refresh overlay by default', () => {
    renderGrid([makeTask({ id: '1' })]);

    expect(screen.queryByLabelText('Refreshing task list')).not.toBeInTheDocument();
  });

  it('shows a refresh overlay when isRefreshing is true', () => {
    renderGrid([makeTask({ id: '1' })], true);

    expect(screen.getByLabelText('Refreshing task list')).toBeInTheDocument();
  });
});
