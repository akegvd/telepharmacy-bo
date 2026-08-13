import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SnackbarProvider } from '@/shared/components/SnackbarProvider';
import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';
import { createRandomTask, resetTaskList } from '@/shared/services/api/tasks';
import { ITaskItemResponse } from '@/shared/types/api/tasks';

import { DevApiControlPanel } from './DevApiControlPanel';

jest.mock('@/shared/services/api/tasks');

const mockCreateRandomTask = createRandomTask as jest.MockedFunction<typeof createRandomTask>;
const mockResetTaskList = resetTaskList as jest.MockedFunction<typeof resetTaskList>;

const ORIGINAL_ENV = process.env;

const makeRawTask = (overrides: Partial<ITaskItemResponse> = {}): ITaskItemResponse => {
  return {
    id: '21',
    customerName: 'Areeya Suksan',
    serviceType: SERVICE_TYPE.CHAT,
    symptom: 'Recurring headache since the weekend',
    status: TASK_STATUS.NEW,
    createdAt: '2026-08-13T15:25:00.000Z',
    ...overrides,
  };
};

interface IRenderPanelOptions {
  taskCount?: number;
}

const renderPanel = ({ taskCount }: IRenderPanelOptions = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

  if (taskCount !== undefined) {
    const taskList = Array.from({ length: taskCount }, (_, index) => ({ id: String(index + 1) }));
    queryClient.setQueryData(taskKeys.list(), { taskList });
  }

  const Wrapper = ({ children }: { children: ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </QueryClientProvider>
    );
  };

  return render(<DevApiControlPanel />, { wrapper: Wrapper });
};

describe('DevApiControlPanel', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV, NEXT_PUBLIC_ENABLE_DEV_API_CONTROLS: 'true' };
    mockCreateRandomTask.mockReset();
    mockResetTaskList.mockReset();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('renders nothing when the flag is unset', () => {
    delete process.env.NEXT_PUBLIC_ENABLE_DEV_API_CONTROLS;

    const { container } = renderPanel();

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when the flag is set to anything other than "true"', () => {
    process.env.NEXT_PUBLIC_ENABLE_DEV_API_CONTROLS = 'false';

    const { container } = renderPanel();

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the current in-memory API state', () => {
    renderPanel({ taskCount: 3 });

    expect(screen.getByText('Dev API')).toBeInTheDocument();
    expect(screen.getByText('Tasks in view')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Idle')).toBeInTheDocument();
  });

  it('adds a random task through the API', async () => {
    const user = userEvent.setup();
    mockCreateRandomTask.mockResolvedValue(makeRawTask());

    renderPanel({ taskCount: 1 });

    await user.click(screen.getByRole('button', { name: 'Add random task' }));

    await waitFor(() => expect(mockCreateRandomTask).toHaveBeenCalledTimes(1));
    expect(await screen.findByText('Random task added — waiting for the next refresh.')).toBeInTheDocument();
  });

  it('resets the API back to its db.json seed', async () => {
    const user = userEvent.setup();
    mockResetTaskList.mockResolvedValue([makeRawTask({ id: '1' })]);

    renderPanel({ taskCount: 1 });

    await user.click(screen.getByRole('button', { name: 'Reset from db.json' }));

    await waitFor(() => expect(mockResetTaskList).toHaveBeenCalledTimes(1));
    expect(await screen.findByText('Tasks reset from db.json — waiting for the next refresh.')).toBeInTheDocument();
  });

  it('reports a failed action', async () => {
    const user = userEvent.setup();
    mockCreateRandomTask.mockRejectedValue(new Error('Could not reach the API.'));

    renderPanel({ taskCount: 1 });

    await user.click(screen.getByRole('button', { name: 'Add random task' }));

    expect(await screen.findByText('Could not reach the API.')).toBeInTheDocument();
  });

  it('collapses out of the way, hiding its state and actions', async () => {
    const user = userEvent.setup();

    renderPanel({ taskCount: 1 });

    await user.click(screen.getByRole('button', { name: 'Collapse dev API panel' }));

    expect(screen.getByRole('button', { name: 'Expand dev API panel' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Add random task')).not.toBeVisible());
    expect(screen.getByText('Tasks in view')).not.toBeVisible();
  });
});
