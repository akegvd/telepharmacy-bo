import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { fetchTask, updateTaskStatus } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

jest.mock('@/shared/services/api/tasks');

const mockFetchTask = fetchTask as jest.MockedFunction<typeof fetchTask>;
const mockUpdateTaskStatus = updateTaskStatus as jest.MockedFunction<typeof updateTaskStatus>;

import { TaskDetailContent } from './TaskDetailContent';

const renderDetail = (id: string) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <TaskDetailContent id={id} />
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
    mockFetchTask.mockReset();
    mockUpdateTaskStatus.mockReset();
  });

  it('shows a loading spinner before the task resolves', () => {
    mockFetchTask.mockReturnValue(new Promise(() => {}));

    renderDetail('1');

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders the task once loaded', async () => {
    mockFetchTask.mockResolvedValue(makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }));

    renderDetail('1');

    expect(await screen.findByText('Somchai P.')).toBeInTheDocument();
    expect(screen.getByText('Persistent dry cough')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Advance to In progress' })).toBeInTheDocument();
  });

  it("shows an error state when the task can't be found", async () => {
    mockFetchTask.mockRejectedValue(new Error('not found'));

    renderDetail('missing');

    expect(await screen.findByText('This request could not be found.')).toBeInTheDocument();
  });

  it('shows the completed message with no advance action for a completed task', async () => {
    mockFetchTask.mockResolvedValue(makeRawTask({ id: '1', status: TASK_STATUS.COMPLETED }));

    renderDetail('1');

    await screen.findByText('This request has been completed.');
    expect(screen.queryByRole('button', { name: /Advance to/ })).not.toBeInTheDocument();
  });

  it('disables the advance action and flags the raw status when it is unrecognized', async () => {
    mockFetchTask.mockResolvedValue(
      makeRawTask({ id: '1', status: 'pending_review' } as unknown as Partial<ITaskItemResponse>)
    );

    renderDetail('1');

    await screen.findByText('pending_review');
    expect(screen.getByText('Status not recognized — workflow actions are unavailable.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Advance to/ })).not.toBeInTheDocument();
  });

  it('advances the task status when the button is clicked', async () => {
    const user = userEvent.setup();
    mockFetchTask.mockResolvedValue(makeRawTask({ id: '1', status: TASK_STATUS.NEW }));
    mockUpdateTaskStatus.mockResolvedValue(makeRawTask({ id: '1', status: TASK_STATUS.IN_PROGRESS }));

    renderDetail('1');

    const button = await screen.findByRole('button', { name: 'Advance to In progress' });
    await user.click(button);

    expect(mockUpdateTaskStatus).toHaveBeenCalledWith('1', TASK_STATUS.IN_PROGRESS, undefined);
    await screen.findByRole('button', { name: 'Advance to Completed' });
  });

  it('shows an error message when the status update fails', async () => {
    const user = userEvent.setup();
    mockFetchTask.mockResolvedValue(makeRawTask({ id: '1', status: TASK_STATUS.NEW }));
    mockUpdateTaskStatus.mockRejectedValue(new Error('network error'));

    renderDetail('1');

    const button = await screen.findByRole('button', { name: 'Advance to In progress' });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Couldn't update the status. Please try again.")).toBeInTheDocument();
    });
  });
});
