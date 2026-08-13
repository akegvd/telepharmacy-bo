import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { updateTaskStatus } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

jest.mock('@/shared/services/api/tasks');

const mockUpdateTaskStatus = updateTaskStatus as jest.MockedFunction<typeof updateTaskStatus>;

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';

import TaskList from './TaskList';

const onSelectTask = jest.fn();

const renderTaskList = (taskList: Parameters<typeof TaskList>[0]['taskList']) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <VirtuosoMockContext.Provider value={{ viewportHeight: 1000, itemHeight: 61 }}>
        <TaskList taskList={taskList} onSelectTask={onSelectTask} />
      </VirtuosoMockContext.Provider>
    </QueryClientProvider>
  );
};

describe('TaskList', () => {
  beforeEach(() => {
    onSelectTask.mockClear();
    mockUpdateTaskStatus.mockReset();
  });

  it('renders a row for each task', () => {
    const taskList = [
      makeTask({ id: '1', customerName: 'Somchai P.' }),
      makeTask({ id: '2', customerName: 'Nutcha R.' }),
    ];

    renderTaskList(taskList);

    expect(screen.getByText('Somchai P.')).toBeInTheDocument();
    expect(screen.getByText('Nutcha R.')).toBeInTheDocument();
  });

  it('renders no rows when there are no tasks', () => {
    renderTaskList([]);

    expect(screen.queryAllByRole('button', { name: 'View detail' })).toHaveLength(0);
  });

  it('shows the column headers', () => {
    renderTaskList([makeTask()]);

    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Symptom')).toBeInTheDocument();
    expect(screen.getByText('Requested')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('calls onSelectTask when the view detail action is clicked', async () => {
    const user = userEvent.setup();
    renderTaskList([makeTask({ id: '42', customerName: 'Somchai P.' })]);

    await user.click(screen.getByRole('button', { name: 'View detail' }));

    expect(onSelectTask).toHaveBeenCalledWith('42');
  });

  it('does not open a task when clicking elsewhere in the row', async () => {
    const user = userEvent.setup();
    renderTaskList([makeTask({ id: '42', customerName: 'Somchai P.' })]);

    await user.click(screen.getByText('Somchai P.'));

    expect(onSelectTask).not.toHaveBeenCalled();
  });

  it('asks for confirmation before advancing the task status', async () => {
    const user = userEvent.setup();
    mockUpdateTaskStatus.mockResolvedValue({
      id: '42',
      customerName: 'Somchai P.',
      status: TASK_STATUS.IN_PROGRESS,
    } as ITaskItemResponse);
    renderTaskList([makeTask({ id: '42', customerName: 'Somchai P.', status: TASK_STATUS.NEW })]);

    await user.click(screen.getByRole('button', { name: 'Advance' }));
    expect(mockUpdateTaskStatus).not.toHaveBeenCalled();
    expect(screen.getByText("Advance Somchai P.'s request to In progress?")).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockUpdateTaskStatus).toHaveBeenCalledWith('42', TASK_STATUS.IN_PROGRESS, undefined);
  });

  it('does not advance the task status when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    renderTaskList([makeTask({ id: '42', customerName: 'Somchai P.', status: TASK_STATUS.NEW })]);

    await user.click(screen.getByRole('button', { name: 'Advance' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockUpdateTaskStatus).not.toHaveBeenCalled();
    expect(screen.queryByText("Advance Somchai P.'s request to In progress?")).not.toBeInTheDocument();
  });

  it('hides the advance action for a completed task', () => {
    renderTaskList([makeTask({ id: '42', status: TASK_STATUS.COMPLETED })]);

    expect(screen.queryByRole('button', { name: 'Advance' })).not.toBeInTheDocument();
  });

  it('shows a data-issue warning label only when the task has flagged issues', () => {
    const { rerender } = renderTaskList([makeTask({ id: '1', issues: [] })]);
    expect(screen.queryByText('Customer name was missing')).not.toBeInTheDocument();

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    rerender(
      <QueryClientProvider client={queryClient}>
        <VirtuosoMockContext.Provider value={{ viewportHeight: 1000, itemHeight: 61 }}>
          <TaskList
            taskList={[makeTask({ id: '1', customerName: 'Unknown customer', issues: [DATA_ISSUE.MISSING_NAME] })]}
            onSelectTask={onSelectTask}
          />
        </VirtuosoMockContext.Provider>
      </QueryClientProvider>
    );
    expect(screen.getByText('Customer name was missing')).toBeInTheDocument();
  });
});
