import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getDateField, typeDateField } from '../mocks/datePickerField';

import { FilterBar } from './FilterBar';

const defaultProps = {
  search: '',
  service: 'all',
  status: 'all',
  createdFrom: '',
  createdTo: '',
  onSearchChange: jest.fn(),
  onServiceChange: jest.fn(),
  onStatusChange: jest.fn(),
  onCreatedFromChange: jest.fn(),
  onCreatedToChange: jest.fn(),
};

describe('FilterBar', () => {
  it('renders the search value passed in via props', () => {
    render(<FilterBar {...defaultProps} search="Somchai" />);

    expect(screen.getByLabelText('Search customer')).toHaveValue('Somchai');
  });

  it('calls onSearchChange as the user types, without debouncing itself', async () => {
    const user = userEvent.setup();
    const onSearchChange = jest.fn();
    render(<FilterBar {...defaultProps} onSearchChange={onSearchChange} />);

    await user.type(screen.getByLabelText('Search customer'), 'abc');

    // The input stays controlled by the `search` prop (never updated here), so
    // each keystroke reports just the newly typed character, not an accumulated value.
    expect(onSearchChange).toHaveBeenCalledTimes(3);
    expect(onSearchChange).toHaveBeenNthCalledWith(1, 'a');
    expect(onSearchChange).toHaveBeenNthCalledWith(2, 'b');
    expect(onSearchChange).toHaveBeenNthCalledWith(3, 'c');
  });

  it('calls onServiceChange when the service filter changes', async () => {
    const user = userEvent.setup();
    const onServiceChange = jest.fn();
    render(<FilterBar {...defaultProps} onServiceChange={onServiceChange} />);

    await user.click(screen.getByLabelText('Service'));
    await user.click(await screen.findByRole('option', { name: 'video call' }));

    expect(onServiceChange).toHaveBeenCalledWith('video_call');
  });

  it('calls onStatusChange when the status filter changes', async () => {
    const user = userEvent.setup();
    const onStatusChange = jest.fn();
    render(<FilterBar {...defaultProps} onStatusChange={onStatusChange} />);

    await user.click(screen.getByLabelText('Status'));
    const option = (await screen.findAllByRole('option'))[1];
    await user.click(option);

    expect(onStatusChange).toHaveBeenCalled();
  });

  it('renders the createdFrom/createdTo values passed in via props', () => {
    render(<FilterBar {...defaultProps} createdFrom="2026-08-01" createdTo="2026-08-15" />);

    expect(getDateField('Created from')).toHaveTextContent('08/01/2026');
    expect(getDateField('Created to')).toHaveTextContent('08/15/2026');
  });

  it('calls onCreatedFromChange when a from-date is typed', async () => {
    const user = userEvent.setup();
    const onCreatedFromChange = jest.fn();
    render(<FilterBar {...defaultProps} onCreatedFromChange={onCreatedFromChange} />);

    await typeDateField(user, 'Created from', '08012026');

    expect(onCreatedFromChange).toHaveBeenLastCalledWith('2026-08-01');
  });

  it('calls onCreatedToChange when a to-date is typed', async () => {
    const user = userEvent.setup();
    const onCreatedToChange = jest.fn();
    render(<FilterBar {...defaultProps} onCreatedToChange={onCreatedToChange} />);

    await typeDateField(user, 'Created to', '08152026');

    expect(onCreatedToChange).toHaveBeenLastCalledWith('2026-08-15');
  });
});
