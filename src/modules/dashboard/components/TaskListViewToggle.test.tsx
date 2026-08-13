import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TaskListViewToggle } from './TaskListViewToggle';

describe('TaskListViewToggle', () => {
  it('marks the current view as selected', () => {
    render(<TaskListViewToggle value="table" onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Table view' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Card view' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onChange with the newly selected view', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<TaskListViewToggle value="table" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Card view' }));

    expect(onChange).toHaveBeenCalledWith('grid');
  });

  it('does not call onChange when clicking the already-selected view', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<TaskListViewToggle value="table" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Table view' }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
