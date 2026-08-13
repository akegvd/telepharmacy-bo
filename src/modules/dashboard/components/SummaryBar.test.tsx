import { render, screen } from '@testing-library/react';

import TASK_STATUS from '@/shared/enums/api/tasks/status';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';
import { buildTaskListSummary } from '../utils/transforms/transformTaskListResponse';

import { SummaryBar } from './SummaryBar';

describe('SummaryBar', () => {
  it('counts tasks per status', () => {
    render(
      <SummaryBar
        summary={buildTaskListSummary([
          makeTask({ id: '1', status: TASK_STATUS.NEW }),
          makeTask({ id: '2', status: TASK_STATUS.NEW }),
          makeTask({ id: '3', status: TASK_STATUS.IN_PROGRESS }),
          makeTask({ id: '4', status: TASK_STATUS.COMPLETED }),
        ])}
      />
    );

    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getAllByText('1')).toHaveLength(2);
    expect(screen.getByText('In progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows zero counts for every status when there are no tasks', () => {
    render(<SummaryBar summary={buildTaskListSummary([])} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(4);
  });

  it('does not show a Flagged count when no tasks have issues', () => {
    render(<SummaryBar summary={buildTaskListSummary([makeTask({ issues: [] })])} />);

    expect(screen.queryByText('Flagged')).not.toBeInTheDocument();
    expect(screen.queryByTestId('WarningAmberIcon')).not.toBeInTheDocument();
  });

  it('shows a compact Flagged remark under the summary box for tasks with data issues', () => {
    render(
      <SummaryBar
        summary={buildTaskListSummary([
          makeTask({ id: '1', issues: [DATA_ISSUE.MISSING_NAME] }),
          makeTask({ id: '2', issues: [DATA_ISSUE.INVALID_DATE] }),
          makeTask({ id: '3', issues: [] }),
        ])}
      />
    );

    expect(screen.getByText('2 Flagged')).toBeInTheDocument();
    expect(screen.getByTestId('WarningAmberIcon')).toBeInTheDocument();
  });
});
