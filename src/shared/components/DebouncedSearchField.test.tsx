import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DebouncedSearchField from './DebouncedSearchField';

const defaultProps = {
  label: 'Search customer',
  value: '',
  onDebouncedChange: jest.fn(),
};

describe('DebouncedSearchField', () => {
  beforeEach(() => {
    jest.useFakeTimers({ advanceTimers: true });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the initial value passed in via props', () => {
    render(<DebouncedSearchField {...defaultProps} value="Somchai" />);

    expect(screen.getByLabelText('Search customer')).toHaveValue('Somchai');
  });

  it('shows every keystroke immediately while typing', async () => {
    const user = userEvent.setup({ delay: null });
    render(<DebouncedSearchField {...defaultProps} />);

    await user.type(screen.getByLabelText('Search customer'), 'abc');

    expect(screen.getByLabelText('Search customer')).toHaveValue('abc');
  });

  it('reports the value only once typing pauses', async () => {
    const user = userEvent.setup({ delay: null });
    const onDebouncedChange = jest.fn();
    render(<DebouncedSearchField {...defaultProps} onDebouncedChange={onDebouncedChange} />);

    await user.type(screen.getByLabelText('Search customer'), 'abc');
    expect(onDebouncedChange).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(300);

    expect(onDebouncedChange).toHaveBeenCalledTimes(1);
    expect(onDebouncedChange).toHaveBeenCalledWith('abc');
  });

  it('honours a custom debounce duration', async () => {
    const user = userEvent.setup({ delay: null });
    const onDebouncedChange = jest.fn();
    render(<DebouncedSearchField {...defaultProps} onDebouncedChange={onDebouncedChange} debounceMs={1000} />);

    await user.type(screen.getByLabelText('Search customer'), 'a');

    await jest.advanceTimersByTimeAsync(300);
    expect(onDebouncedChange).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(700);
    expect(onDebouncedChange).toHaveBeenCalledWith('a');
  });

  it('adopts a value changed from the outside', () => {
    const { rerender } = render(<DebouncedSearchField {...defaultProps} value="Somchai" />);

    rerender(<DebouncedSearchField {...defaultProps} value="" />);

    expect(screen.getByLabelText('Search customer')).toHaveValue('');
  });

  it('keeps what was typed when the parent echoes back the value it was just given', async () => {
    const user = userEvent.setup({ delay: null });
    const onDebouncedChange = jest.fn();
    const { rerender } = render(<DebouncedSearchField {...defaultProps} onDebouncedChange={onDebouncedChange} />);

    await user.type(screen.getByLabelText('Search customer'), 'ab');
    await jest.advanceTimersByTimeAsync(300);
    await user.type(screen.getByLabelText('Search customer'), 'c');

    // The parent re-renders with the debounced value it received, which is now stale.
    rerender(<DebouncedSearchField {...defaultProps} value="ab" onDebouncedChange={onDebouncedChange} />);

    expect(screen.getByLabelText('Search customer')).toHaveValue('abc');
  });

  it('does not report a pending value after unmounting', async () => {
    const user = userEvent.setup({ delay: null });
    const onDebouncedChange = jest.fn();
    const { unmount } = render(<DebouncedSearchField {...defaultProps} onDebouncedChange={onDebouncedChange} />);

    await user.type(screen.getByLabelText('Search customer'), 'abc');
    unmount();

    await jest.advanceTimersByTimeAsync(300);

    expect(onDebouncedChange).not.toHaveBeenCalled();
  });
});
