import { render, screen } from '@testing-library/react';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';

import { TaskSummary } from './TaskSummary';

describe('TaskSummary', () => {
  it('shows the customer name, status, service type, and requested time', () => {
    render(<TaskSummary task={makeTask({ customerName: 'Somchai P.' })} />);

    expect(screen.getByText('Somchai P.')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Video call')).toBeInTheDocument();
  });

  it('shows the reason for consultation as a labelled field', () => {
    render(<TaskSummary task={makeTask({ symptom: 'Persistent dry cough' })} />);

    expect(screen.getByText('Reason for consultation')).toBeInTheDocument();
    expect(screen.getByText('Persistent dry cough')).toBeInTheDocument();
  });

  it('does not show an issues alert when the task has no flagged issues', () => {
    render(<TaskSummary task={makeTask({ issues: [] })} />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows an issues alert with a readable message for each flagged issue', () => {
    render(<TaskSummary task={makeTask({ issues: [DATA_ISSUE.MISSING_NAME, DATA_ISSUE.INVALID_DATE] })} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('The customer name was missing from this request.')).toBeInTheDocument();
    expect(screen.getByText("The request date is missing or couldn't be parsed.")).toBeInTheDocument();
  });

  it('renders a section divider between the meta row and the reason field by default', () => {
    const { container } = render(<TaskSummary task={makeTask()} />);

    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('omits the section divider in dense mode', () => {
    const { container } = render(<TaskSummary task={makeTask()} dense />);

    expect(container.querySelector('hr')).not.toBeInTheDocument();
  });
});
