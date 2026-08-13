import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SnackbarProvider } from '@/shared/components/SnackbarProvider';
import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { updateTaskStatus } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

jest.mock('@/shared/services/api/tasks');

const mockUpdateTaskStatus = updateTaskStatus as jest.MockedFunction<typeof updateTaskStatus>;

import { TaskDetailContent } from './TaskDetailContent';

const renderDetail = (task: ITransformTaskItemResponse) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <TaskDetailContent task={task} />
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

const makeRawTask = (overrides: Partial<ITaskItemResponse> = {}): ITaskItemResponse => {
  return {
    id: '1',
    customerName: 'Somchai P.',
    serviceType: SERVICE_TYPE.VIDEO_CALL,
    symptom: 'Persistent dry cough',
    status: TASK_STATUS.NEW,
    createdAt: '2026-08-09T09:12:00.000Z',
    ...overrides,
  };
};

describe('TaskDetailContent', () => {
  beforeEach(() => {
    mockUpdateTaskStatus.mockReset();
  });

  it('renders the task', () => {
    renderDetail(makeTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }));

    expect(screen.getByText('Somchai P.')).toBeInTheDocument();
    expect(screen.getByText('Persistent dry cough')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Advance to In progress' })).toBeInTheDocument();
  });

  it('shows the completed message with no advance action for a completed task', () => {
    renderDetail(makeTask({ id: '1', status: TASK_STATUS.COMPLETED }));

    expect(screen.getByText('This request has been completed.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Advance to/ })).not.toBeInTheDocument();
  });

  it('disables the advance action and flags the raw status when it is unrecognized', () => {
    renderDetail(
      makeTask({
        id: '1',
        status: 'pending_review' as TASK_STATUS,
        displayStatus: 'pending_review',
        nextStatus: null,
        issues: [DATA_ISSUE.UNKNOWN_STATUS],
      })
    );

    expect(screen.getByText('pending_review')).toBeInTheDocument();
    expect(screen.getByText('Status not recognized — workflow actions are unavailable.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Advance to/ })).not.toBeInTheDocument();
  });

  it('asks for confirmation before advancing the task status', async () => {
    const user = userEvent.setup();
    renderDetail(makeTask({ id: '1', status: TASK_STATUS.NEW }));

    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));

    expect(mockUpdateTaskStatus).not.toHaveBeenCalled();
    expect(screen.getByText("Advance Somchai P.'s request to In progress?")).toBeInTheDocument();
  });

  it('does not advance the task status when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    renderDetail(makeTask({ id: '1', status: TASK_STATUS.NEW }));

    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockUpdateTaskStatus).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText("Advance Somchai P.'s request to In progress?")).not.toBeInTheDocument();
    });
  });

  it('advances the task status and shows a success toast after confirming', async () => {
    const user = userEvent.setup();
    mockUpdateTaskStatus.mockResolvedValue(makeRawTask({ id: '1', status: TASK_STATUS.IN_PROGRESS }));
    renderDetail(makeTask({ id: '1', status: TASK_STATUS.NEW }));

    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockUpdateTaskStatus).toHaveBeenCalledWith('1', TASK_STATUS.IN_PROGRESS, undefined);
    expect(await screen.findByText('Advanced to In progress.')).toBeInTheDocument();
  });

  it('shows an error toast when the status update fails', async () => {
    const user = userEvent.setup();
    mockUpdateTaskStatus.mockRejectedValue(new Error('network error'));
    renderDetail(makeTask({ id: '1', status: TASK_STATUS.NEW }));

    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(screen.getByText("Couldn't update the status. Please try again.")).toBeInTheDocument();
    });
  });
});
