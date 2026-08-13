import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';

import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { fetchTaskList } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

jest.mock('@/shared/services/api/tasks');

const mockFetchTaskList = fetchTaskList as jest.MockedFunction<typeof fetchTaskList>;

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
    <VirtuosoMockContext.Provider value={{ viewportHeight: 1000, itemHeight: 61 }}>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </VirtuosoMockContext.Provider>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    mockFetchTaskList.mockReset();
    mockPush.mockClear();
    mockReplace.mockClear();
    searchParams = new URLSearchParams();
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
    const flaggedLabel = screen.getByText('Flagged');
    expect(flaggedLabel.previousSibling).toHaveTextContent('1');
  });

  it('shows an empty state message when there are no tasks', async () => {
    mockFetchTaskList.mockResolvedValue([]);

    renderDashboard();

    expect(await screen.findByText('No consultation requests yet.')).toBeInTheDocument();
  });

  it('shows a filtered empty state when filters exclude every task', async () => {
    searchParams = new URLSearchParams({ status: 'completed' });
    mockFetchTaskList.mockResolvedValue([makeRawTask({ id: '1', status: TASK_STATUS.NEW })]);

    renderDashboard();

    expect(await screen.findByText('No requests match your filters.')).toBeInTheDocument();
  });

  it('pushes the id query param when the view detail action is clicked', async () => {
    const user = userEvent.setup();
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();

    await screen.findByText('Somchai P.');
    await user.click(screen.getByRole('button', { name: 'View detail' }));

    expect(mockPush).toHaveBeenCalledWith('/?id=1', { scroll: false });
  });

  it('shows the task detail modal when the id query param is present, and closes it by removing the param', async () => {
    const user = userEvent.setup();
    searchParams = new URLSearchParams({ id: '1' });
    mockFetchTaskList.mockResolvedValue([
      makeRawTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
    ]);

    renderDashboard();

    expect(await screen.findByRole('button', { name: 'Close' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(mockPush).toHaveBeenCalledWith('/?', { scroll: false });
  });
});
