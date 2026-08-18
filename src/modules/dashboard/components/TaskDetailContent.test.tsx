import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TASK_STATUS from '@/shared/enums/api/tasks/status';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import { TaskDetailContent } from './TaskDetailContent';

const renderDetail = (task: ITransformTaskItemResponse, onAdvance = jest.fn()) => {
  render(<TaskDetailContent task={task} onAdvance={onAdvance} />);
  return { onAdvance };
};

describe('TaskDetailContent', () => {
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

  it('raises onAdvance with the task when the advance action is clicked', async () => {
    const user = userEvent.setup();
    const task = makeTask({ id: '1', status: TASK_STATUS.NEW });
    const { onAdvance } = renderDetail(task);

    await user.click(screen.getByRole('button', { name: 'Advance to In progress' }));

    expect(onAdvance).toHaveBeenCalledWith(task);
  });
});
