import { render, screen } from '@testing-library/react';
import { VirtuosoMockContext } from 'react-virtuoso';

import { makeTask } from '../mocks/taskFixtures';

import { TaskList } from './TaskList';

const push = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

function renderTaskList(tasks: Parameters<typeof TaskList>[0]['tasks']) {
  return render(
    <VirtuosoMockContext.Provider value={{ viewportHeight: 1000, itemHeight: 61 }}>
      <TaskList tasks={tasks} />
    </VirtuosoMockContext.Provider>
  );
}

describe('TaskList', () => {
  beforeEach(() => {
    push.mockClear();
  });

  it('renders a row for each task', () => {
    const tasks = [makeTask({ id: '1', customerName: 'Somchai P.' }), makeTask({ id: '2', customerName: 'Nutcha R.' })];

    renderTaskList(tasks);

    expect(screen.getByText('Somchai P.')).toBeInTheDocument();
    expect(screen.getByText('Nutcha R.')).toBeInTheDocument();
  });

  it('renders no rows when there are no tasks', () => {
    renderTaskList([]);

    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('shows the column headers', () => {
    renderTaskList([makeTask()]);

    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Symptom')).toBeInTheDocument();
    expect(screen.getByText('Requested')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it("navigates to the task's detail route when a row is clicked", () => {
    renderTaskList([makeTask({ id: '42', customerName: 'Somchai P.' })]);

    screen.getByText('Somchai P.').closest('tr')?.click();

    expect(push).toHaveBeenCalledWith('/task/42');
  });

  it('shows a data-issue warning icon only when the task has flagged issues', () => {
    const { rerender } = renderTaskList([makeTask({ id: '1', issues: [] })]);
    expect(screen.queryByTestId('data-issue-warning')).not.toBeInTheDocument();

    rerender(
      <VirtuosoMockContext.Provider value={{ viewportHeight: 1000, itemHeight: 61 }}>
        <TaskList tasks={[makeTask({ id: '1', customerName: 'Unknown customer', issues: ['missing_name'] })]} />
      </VirtuosoMockContext.Provider>
    );
    expect(screen.getByTestId('data-issue-warning')).toBeInTheDocument();
  });
});
