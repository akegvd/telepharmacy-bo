import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('renders the search value passed in via props', () => {
    render(
      <FilterBar
        search="Somchai"
        service="all"
        status="all"
        onSearchChange={jest.fn()}
        onServiceChange={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Search customer')).toHaveValue('Somchai');
  });

  it('calls onSearchChange as the user types, without debouncing itself', async () => {
    const user = userEvent.setup();
    const onSearchChange = jest.fn();
    render(
      <FilterBar
        search=""
        service="all"
        status="all"
        onSearchChange={onSearchChange}
        onServiceChange={jest.fn()}
        onStatusChange={jest.fn()}
      />
    );

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
    render(
      <FilterBar
        search=""
        service="all"
        status="all"
        onSearchChange={jest.fn()}
        onServiceChange={onServiceChange}
        onStatusChange={jest.fn()}
      />
    );

    await user.click(screen.getByLabelText('Service'));
    await user.click(await screen.findByRole('option', { name: 'video call' }));

    expect(onServiceChange).toHaveBeenCalledWith('video_call');
  });

  it('calls onStatusChange when the status filter changes', async () => {
    const user = userEvent.setup();
    const onStatusChange = jest.fn();
    render(
      <FilterBar
        search=""
        service="all"
        status="all"
        onSearchChange={jest.fn()}
        onServiceChange={jest.fn()}
        onStatusChange={onStatusChange}
      />
    );

    await user.click(screen.getByLabelText('Status'));
    const option = (await screen.findAllByRole('option'))[1];
    await user.click(option);

    expect(onStatusChange).toHaveBeenCalled();
  });
});
