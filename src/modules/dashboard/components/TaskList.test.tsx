import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import TaskList from './TaskList';

const onSelectTask = jest.fn();

const renderTaskList = (taskList: ITransformTaskItemResponse[]) => {
  return render(<TaskList taskList={taskList} onSelectTask={onSelectTask} />);
};

describe('TaskList', () => {
  beforeEach(() => {
    onSelectTask.mockClear();
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

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('shows the column headers', () => {
    renderTaskList([makeTask()]);

    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Service')).toBeInTheDocument();
    expect(screen.getByText('Symptom')).toBeInTheDocument();
    expect(screen.getByText('Requested')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('calls onSelectTask when the row is clicked', async () => {
    const user = userEvent.setup();
    renderTaskList([makeTask({ id: '42', customerName: 'Somchai P.' })]);

    await user.click(screen.getByText('Somchai P.'));

    expect(onSelectTask).toHaveBeenCalledWith('42');
  });

  it('calls onSelectTask when the row is activated with the keyboard', async () => {
    const user = userEvent.setup();
    renderTaskList([makeTask({ id: '42', customerName: 'Somchai P.' })]);

    screen.getByRole('button', { name: 'Request from Somchai P.' }).focus();
    await user.keyboard('{Enter}');

    expect(onSelectTask).toHaveBeenCalledWith('42');
  });

  it('shows a short remark under the customer name only when the task has flagged issues', () => {
    const { rerender } = renderTaskList([makeTask({ id: '1', issues: [] })]);
    expect(screen.queryByText('Some data invalid')).not.toBeInTheDocument();

    rerender(
      <TaskList
        taskList={[makeTask({ id: '1', customerName: 'Unknown customer', issues: [DATA_ISSUE.MISSING_NAME] })]}
        onSelectTask={onSelectTask}
      />
    );
    const nameCell = screen.getByText('Unknown customer').closest('td');
    expect(nameCell).toContainElement(screen.getByText('Some data invalid'));
  });

  it('shows a refresh overlay only when isRefreshing is true', () => {
    const taskList = [makeTask({ id: '1', customerName: 'Somchai P.' })];
    const { rerender } = renderTaskList(taskList);
    expect(screen.queryByLabelText('Refreshing task list')).not.toBeInTheDocument();

    rerender(<TaskList taskList={taskList} onSelectTask={onSelectTask} isRefreshing />);
    expect(screen.getByLabelText('Refreshing task list')).toBeInTheDocument();
  });
});
