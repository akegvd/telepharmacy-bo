import { render, screen } from '@testing-library/react';

import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { StatusChip } from './StatusChip';

describe('StatusChip', () => {
  it.each<[TASK_STATUS, string]>([
    [TASK_STATUS.NEW, 'New'],
    [TASK_STATUS.IN_PROGRESS, 'In progress'],
    [TASK_STATUS.COMPLETED, 'Completed'],
  ])('renders the label for status %s', (status, label) => {
    render(<StatusChip status={status} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders the raw value for an unrecognized status instead of a known label', () => {
    render(<StatusChip status="pending_review" />);

    expect(screen.getByText('pending_review')).toBeInTheDocument();
  });

  it('falls back to a generic label when the raw value is also blank', () => {
    render(<StatusChip status="" />);

    expect(screen.getByText('Unrecognized')).toBeInTheDocument();
  });

  it('matches snapshot for each status', () => {
    const statuses: TASK_STATUS[] = [TASK_STATUS.NEW, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED];

    statuses.forEach((status) => {
      const { container, unmount } = render(<StatusChip status={status} />);
      expect(container).toMatchSnapshot(status);
      unmount();
    });
  });
});
