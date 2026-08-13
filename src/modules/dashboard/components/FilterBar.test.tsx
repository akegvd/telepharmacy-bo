import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const replace = jest.fn();
let searchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  useSearchParams: () => searchParams,
}));

import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  beforeEach(() => {
    replace.mockClear();
    searchParams = new URLSearchParams();
  });

  it('pre-fills the search box from the current ?q param', () => {
    searchParams = new URLSearchParams({ q: 'Somchai' });
    render(<FilterBar />);

    expect(screen.getByLabelText('Search customer')).toHaveValue('Somchai');
  });

  it('updates the URL immediately when the service filter changes', async () => {
    const user = userEvent.setup();
    render(<FilterBar />);

    await user.click(screen.getByLabelText('Service'));
    await user.click(await screen.findByRole('option', { name: 'video call' }));

    expect(replace).toHaveBeenCalledWith('/?service=video_call', { scroll: false });
  });

  it('debounces search input before updating the URL', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    const user = userEvent.setup({ delay: null });
    render(<FilterBar />);
    replace.mockClear(); // the sync-on-mount effect already fired once

    await user.type(screen.getByLabelText('Search customer'), 'abc');
    expect(replace).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(replace).toHaveBeenCalledWith('/?q=abc', { scroll: false });

    jest.useRealTimers();
  });
});
