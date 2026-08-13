import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';

import { fetchTasks } from '@/shared/services/api/tasks';

import { makeTask } from '../mocks/taskFixtures';

jest.mock('@/shared/services/api/tasks');

const mockFetchTasks = fetchTasks as jest.MockedFunction<typeof fetchTasks>;

let searchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
  useSearchParams: () => searchParams,
}));

import { Dashboard } from './Dashboard';

function renderDashboard() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <VirtuosoMockContext.Provider value={{ viewportHeight: 1000, itemHeight: 61 }}>
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    </VirtuosoMockContext.Provider>
  );
}

describe('Dashboard', () => {
  beforeEach(() => {
    mockFetchTasks.mockReset();
    searchParams = new URLSearchParams();
  });

  it('shows a loading spinner before tasks resolve', () => {
    mockFetchTasks.mockReturnValue(new Promise(() => {}));

    renderDashboard();

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders the task list once loaded, with the summary and rows', async () => {
    mockFetchTasks.mockResolvedValue([
      makeTask({ id: '1', customerName: 'Somchai P.', status: 'new' }),
      makeTask({ id: '2', customerName: 'Nutcha R.', status: 'in_progress' }),
    ]);

    renderDashboard();

    expect(await screen.findByText('Somchai P.')).toBeInTheDocument();
    expect(screen.getByText('Nutcha R.')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(2); // 1 New, 1 In progress in the summary bar
  });

  it('shows an error alert with a retry action when the fetch fails', async () => {
    mockFetchTasks.mockRejectedValue(new Error('Could not reach the API'));

    renderDashboard();

    expect(await screen.findByText('Could not reach the API')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('shows the data issues banner when records were flagged or deduplicated', async () => {
    mockFetchTasks.mockResolvedValue([
      {
        id: '1',
        customerName: null,
        serviceType: 'video_call',
        symptom: 'Persistent dry cough',
        status: 'new',
        createdAt: '2026-08-09T09:12:00.000Z',
      },
      {
        id: '2',
        customerName: 'Nutcha R.',
        serviceType: 'chat',
        symptom: 'Headache',
        status: 'new',
        createdAt: '2026-08-09T09:12:00.000Z',
      },
      {
        id: '2',
        customerName: 'Duplicate',
        serviceType: 'chat',
        symptom: 'Headache',
        status: 'new',
        createdAt: '2026-08-09T09:13:00.000Z',
      },
    ]);

    renderDashboard();

    expect(await screen.findByText(/1 request had missing or invalid data/)).toBeInTheDocument();
    expect(screen.getByText(/1 duplicate record \(id: 2\) was hidden/)).toBeInTheDocument();
  });

  it('shows an empty state message when there are no tasks', async () => {
    mockFetchTasks.mockResolvedValue([]);

    renderDashboard();

    expect(await screen.findByText('No consultation requests yet.')).toBeInTheDocument();
  });

  it('shows a filtered empty state when filters exclude every task', async () => {
    searchParams = new URLSearchParams({ status: 'completed' });
    mockFetchTasks.mockResolvedValue([makeTask({ id: '1', status: 'new' })]);

    renderDashboard();

    expect(await screen.findByText('No requests match your filters.')).toBeInTheDocument();
  });
});
