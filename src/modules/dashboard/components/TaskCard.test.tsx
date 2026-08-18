import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TASK_STATUS from '@/shared/enums/api/tasks/status';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';

import { TaskCard } from './TaskCard';

const renderCard = (overrides: Parameters<typeof makeTask>[0] = {}, onAdvance = jest.fn()) => {
  render(<TaskCard task={makeTask(overrides)} onAdvance={onAdvance} />);
  return { onAdvance };
};

describe('TaskCard', () => {
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

  it('raises onAdvance with the task when the advance action is clicked', async () => {
    const user = userEvent.setup();
    const task = makeTask({ id: '42', customerName: 'Somchai P.', status: TASK_STATUS.NEW });
    const onAdvance = jest.fn();
    render(<TaskCard task={task} onAdvance={onAdvance} />);

    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));

    expect(onAdvance).toHaveBeenCalledWith(task);
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
