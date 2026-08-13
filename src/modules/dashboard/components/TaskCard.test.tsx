import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SnackbarProvider from '@/shared/components/SnackbarProvider';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { updateTaskStatus } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

jest.mock('@/shared/services/api/tasks');

const mockUpdateTaskStatus = updateTaskStatus as jest.MockedFunction<typeof updateTaskStatus>;

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';

import TaskCard from './TaskCard';

const renderCard = (overrides: Parameters<typeof makeTask>[0] = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <TaskCard task={makeTask(overrides)} />
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

const makeRawTask = (overrides: Partial<ITaskItemResponse> = {}): ITaskItemResponse => ({
  id: '42',
  customerName: 'Somchai P.',
  status: TASK_STATUS.IN_PROGRESS,
  createdAt: '2026-08-09T09:12:00.000Z',
  ...overrides,
});

describe('TaskCard', () => {
  beforeEach(() => {
    mockUpdateTaskStatus.mockReset();
  });

  it('shows the task details', () => {
    renderCard({ customerName: 'Somchai P.' });

    expect(screen.getByText('Somchai P.')).toBeInTheDocument();
    expect(screen.getByText('Persistent dry cough')).toBeInTheDocument();
  });

  it('shows an advance action for a task with a next status', () => {
    renderCard({ status: TASK_STATUS.NEW });

    expect(screen.getByRole('button', { name: 'Advance to In progress' })).toBeInTheDocument();
  });

  it('shows the completed message with no advance action for a completed task', () => {
    renderCard({ status: TASK_STATUS.COMPLETED });

    expect(screen.getByText('This request has been completed.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Advance to/ })).not.toBeInTheDocument();
  });

  it('asks for confirmation before advancing the task status', async () => {
    const user = userEvent.setup();
    renderCard({ id: '42', customerName: 'Somchai P.', status: TASK_STATUS.NEW });

    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));

    expect(mockUpdateTaskStatus).not.toHaveBeenCalled();
    expect(screen.getByText("Advance Somchai P.'s request to In progress?")).toBeInTheDocument();
  });

  it('does not advance the task status when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    renderCard({ id: '42', customerName: 'Somchai P.', status: TASK_STATUS.NEW });

    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockUpdateTaskStatus).not.toHaveBeenCalled();
  });

  it('advances the task status and shows a success toast after confirming', async () => {
    const user = userEvent.setup();
    mockUpdateTaskStatus.mockResolvedValue(makeRawTask({ status: TASK_STATUS.IN_PROGRESS }));
    renderCard({ id: '42', customerName: 'Somchai P.', status: TASK_STATUS.NEW });

    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockUpdateTaskStatus).toHaveBeenCalledWith('42', TASK_STATUS.IN_PROGRESS, undefined);
    expect(await screen.findByText('Advanced to In progress.')).toBeInTheDocument();
  });

  it('shows an error toast when the status update fails', async () => {
    const user = userEvent.setup();
    mockUpdateTaskStatus.mockRejectedValue(new Error('network error'));
    renderCard({ id: '42', status: TASK_STATUS.NEW });

    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(await screen.findByText("Couldn't update the status. Please try again.")).toBeInTheDocument();
  });

  it('shows a data-issue warning alert only when the task has flagged issues', () => {
    renderCard({ issues: [] });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the data-issue warning alert when the task has flagged issues', () => {
    renderCard({ customerName: 'Unknown customer', issues: [DATA_ISSUE.MISSING_NAME] });

    expect(screen.getByText('The customer name was missing from this request.')).toBeInTheDocument();
  });
});
