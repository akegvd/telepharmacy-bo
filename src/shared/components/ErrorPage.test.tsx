import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorPage } from './ErrorPage';

describe('ErrorPage', () => {
  it('renders the error heading and a link back to the dashboard', () => {
    render(<ErrorPage error={new Error('boom')} reset={jest.fn()} />);

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(
      screen.getByText('An unexpected error occurred. You can try again, or return to the dashboard.')
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to Dashboard' })).toHaveAttribute('href', '/');
  });

  it('shows a digest reference when the error includes one', () => {
    const error = Object.assign(new Error('boom'), { digest: 'abc123' });

    render(<ErrorPage error={error} reset={jest.fn()} />);

    expect(screen.getByText('Reference: abc123')).toBeInTheDocument();
  });

  it('calls reset when Try again is clicked', async () => {
    const user = userEvent.setup();
    const reset = jest.fn();

    render(<ErrorPage error={new Error('boom')} reset={reset} />);

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
