import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import dayjs from 'dayjs';

import { SnackbarProvider } from '@/shared/components/SnackbarProvider';
import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { fetchTaskList, updateTaskStatus } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { typeDateField } from '../mocks/datePickerField';

jest.mock('@/shared/services/api/tasks');

const mockFetchTaskList = fetchTaskList as jest.MockedFunction<typeof fetchTaskList>;
const mockUpdateTaskStatus = updateTaskStatus as jest.MockedFunction<typeof updateTaskStatus>;

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

let searchParams = new URLSearchParams();
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
  useSearchParams: () => searchParams,
}));

import Dashboard from './Dashboard';

const renderDashboard = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <Dashboard />
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

// The card grid is the only view with inline advance actions, so the advance flow
// is driven through it.
const renderCardView = () => {
  window.localStorage.setItem('dashboard:taskListViewMode', JSON.stringify('grid'));
  return renderDashboard();
};

describe('Dashboard', () => {
  beforeEach(() => {
    mockFetchTaskList.mockReset();
    mockUpdateTaskStatus.mockReset();
    mockPush.mockClear();
    mockReplace.mockClear();
    searchParams = new URLSearchParams();
    window.localStorage.clear();
  });

  it('shows a loading spinner before tasks resolve', () => {
    mockFetchTaskList.mockReturnValue(new Promise(() => {}));

    renderDashboard();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders the task list once loaded, with the summary and rows', async () => {
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
      makeRawTask({ id: '2', customerName: 'Nutcha R.', status: TASK_STATUS.IN_PROGRESS }),
    ]);

    renderDashboard();

    expect(await screen.findByText('Somchai P.')).toBeInTheDocument();
    expect(screen.getByText('Nutcha R.')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(2); // 1 New, 1 In progress in the summary bar
  });

  it('shows an error alert with a retry action when the fetch fails', async () => {
    mockFetchTaskList.mockRejectedValue(new Error('Could not reach the API'));

    renderDashboard();

    expect(await screen.findByText('Could not reach the API')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('keeps duplicate-id rows visible without flagging them, and flags other data issues', async () => {
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({
        id: '1',
        customerName: null,
        serviceType: SERVICE_TYPE.VIDEO_CALL,
        symptom: 'Persistent dry cough',
        status: TASK_STATUS.NEW,
        createdAt: '2026-08-09T09:12:00.000Z',
      }),
      makeRawTask({
        id: '2',
        customerName: 'Nutcha R.',
        serviceType: SERVICE_TYPE.CHAT,
        symptom: 'Headache',
        status: TASK_STATUS.NEW,
        createdAt: '2026-08-09T09:12:00.000Z',
      }),
      makeRawTask({
        id: '2',
        customerName: 'Duplicate',
        serviceType: SERVICE_TYPE.CHAT,
        symptom: 'Headache',
        status: TASK_STATUS.NEW,
        createdAt: '2026-08-09T09:13:00.000Z',
      }),
    ]);

    renderDashboard();

    // 1 flagged: the missing-name task. Both id-"2" rows are kept, not dropped, but duplicate ids aren't flagged.
    expect(await screen.findByText('Nutcha R.')).toBeInTheDocument();
    expect(screen.getByText('Duplicate')).toBeInTheDocument();
    expect(screen.getByText('1 Flagged')).toBeInTheDocument();
  });

  it('shows an empty state message when there are no tasks', async () => {
    mockFetchTaskList.mockResolvedValue([]);

    renderDashboard();

    expect(await screen.findByText('No consultation requests yet.')).toBeInTheDocument();
  });

  it('debounces search input before updating the URL', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    const user = userEvent.setup({ delay: null });
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();
    await screen.findByText('Somchai P.');
    mockReplace.mockClear();

    await user.type(screen.getByLabelText('Search customer'), 'abc');
    expect(mockReplace).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(300);
    expect(mockReplace).toHaveBeenCalledWith('/?customerName=abc', { scroll: false });

    jest.useRealTimers();
  });

  it('updates the URL immediately when the service filter changes', async () => {
    const user = userEvent.setup();
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();
    await screen.findByText('Somchai P.');
    mockReplace.mockClear();

    await user.click(screen.getByLabelText('Service'));
    await user.click(await screen.findByRole('option', { name: 'video call' }));

    expect(mockReplace).toHaveBeenCalledWith('/?service=video_call', { scroll: false });
  });

  it('shows a filtered empty state when filters exclude every task', async () => {
    searchParams = new URLSearchParams({ status: 'completed' });
    // The API is expected to apply the filter server-side, so it returns nothing here.
    mockFetchTaskList.mockResolvedValue([]);

    renderDashboard();

    expect(await screen.findByText('No requests match your filters.')).toBeInTheDocument();
    expect(mockFetchTaskList).toHaveBeenCalledWith({ status: TASK_STATUS.COMPLETED });
  });

  it('sends filters to the API using json-server style query params', async () => {
    searchParams = new URLSearchParams({ customerName: 'Somchai', service: 'chat', status: 'new' });
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', serviceType: SERVICE_TYPE.CHAT, status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();

    await screen.findByText('Somchai P.');
    expect(mockFetchTaskList).toHaveBeenCalledWith({
      customerName_like: 'Somchai',
      serviceType: SERVICE_TYPE.CHAT,
      status: TASK_STATUS.NEW,
    });
  });

  it('sends a createdAt date range to the API when set in the URL', async () => {
    searchParams = new URLSearchParams({ createdFrom: '2026-08-01', createdTo: '2026-08-15' });
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();

    await screen.findByText('Somchai P.');
    expect(mockFetchTaskList).toHaveBeenCalledWith({
      createdAt_gte: dayjs('2026-08-01').startOf('day').toISOString(),
      createdAt_lte: dayjs('2026-08-15').endOf('day').toISOString(),
    });
  });

  it('updates the URL when the created-from date filter changes', async () => {
    const user = userEvent.setup();
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();
    await screen.findByText('Somchai P.');
    mockReplace.mockClear();

    await typeDateField(user, 'Created from', '08012026');

    expect(mockReplace).toHaveBeenCalledWith('/?createdFrom=2026-08-01', { scroll: false });
  });

  it('pushes the taskId query param when a task row is clicked', async () => {
    const user = userEvent.setup();
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();

    await screen.findByText('Somchai P.');
    await user.click(screen.getByText('Somchai P.'));

    expect(mockPush).toHaveBeenCalledWith('/?taskId=1', { scroll: false });
  });

  it('shows the task detail modal when the taskId query param is present, and closes it by removing the param', async () => {
    const user = userEvent.setup();
    searchParams = new URLSearchParams({ taskId: '1' });
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();

    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    // The taskId param is only cleared once the dialog's exit transition finishes.
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/?', { scroll: false }));
  });

  it('switches to card view and persists the choice in localStorage', async () => {
    const user = userEvent.setup();
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();

    await screen.findByText('Somchai P.');
    expect(screen.queryByText('Reason for consultation')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Card view' }));

    expect(screen.getByText('Reason for consultation')).toBeInTheDocument();
    expect(window.localStorage.getItem('dashboard:taskListViewMode')).toBe(JSON.stringify('grid'));
  });

  it('restores the card view from localStorage on load', async () => {
    window.localStorage.setItem('dashboard:taskListViewMode', JSON.stringify('grid'));
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();

    expect(await screen.findByText('Reason for consultation')).toBeInTheDocument();
  });

  it('mounts a single confirm dialog for the whole card grid', async () => {
    const user = userEvent.setup();
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
      makeRawTask({ id: '2', customerName: 'Nutcha R.', status: TASK_STATUS.NEW }),
    ]);

    renderCardView();

    await screen.findByText('Somchai P.');
    expect(screen.queryAllByRole('dialog')).toHaveLength(0);

    await user.click(screen.getAllByRole('button', { name: 'Advance to In progress' })[0]);

    expect(screen.getAllByRole('dialog')).toHaveLength(1);
  });

  it('asks for confirmation before advancing a task status', async () => {
    const user = userEvent.setup();
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderCardView();

    await screen.findByText('Somchai P.');
    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));

    expect(mockUpdateTaskStatus).not.toHaveBeenCalled();
    expect(screen.getByText("Advance Somchai P.'s request to In progress?")).toBeInTheDocument();
  });

  it('does not advance the task status when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderCardView();

    await screen.findByText('Somchai P.');
    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockUpdateTaskStatus).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.queryByText("Advance Somchai P.'s request to In progress?")).not.toBeInTheDocument();
    });
  });

  it('advances the task status and shows a success toast after confirming', async () => {
    const user = userEvent.setup();
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);
    mockUpdateTaskStatus.mockResolvedValue(makeRawTask({ id: '1', status: TASK_STATUS.IN_PROGRESS }));

    renderCardView();

    await screen.findByText('Somchai P.');
    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockUpdateTaskStatus).toHaveBeenCalledWith('1', TASK_STATUS.IN_PROGRESS, undefined);
    expect(await screen.findByText('Advanced to In progress.')).toBeInTheDocument();
  });

  it('shows an error toast when the status update fails', async () => {
    const user = userEvent.setup();
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);
    mockUpdateTaskStatus.mockRejectedValue(new Error('network error'));

    renderCardView();

    await screen.findByText('Somchai P.');
    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(await screen.findByText("Couldn't update the status. Please try again.")).toBeInTheDocument();
  });

  it('advances the task status from the detail modal', async () => {
    const user = userEvent.setup();
    searchParams = new URLSearchParams({ taskId: '1' });
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);
    mockUpdateTaskStatus.mockResolvedValue(makeRawTask({ id: '1', status: TASK_STATUS.IN_PROGRESS }));

    renderDashboard();

    await user.click(await screen.findByRole('button', { name: 'Advance to In progress' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(mockUpdateTaskStatus).toHaveBeenCalledWith('1', TASK_STATUS.IN_PROGRESS, undefined);
    expect(await screen.findByText('Advanced to In progress.')).toBeInTheDocument();
  });

  it('stops polling while paused and refetches immediately on resume', async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();

    await screen.findByText('Somchai P.');
    expect(mockFetchTaskList).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Pause auto-refresh' }));

    await jest.advanceTimersByTimeAsync(30_000);
    expect(mockFetchTaskList).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Resume auto-refresh' }));

    await jest.advanceTimersByTimeAsync(0);
    expect(mockFetchTaskList).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });
});
