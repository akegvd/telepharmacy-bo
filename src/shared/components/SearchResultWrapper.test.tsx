import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchResultWrapper from './SearchResultWrapper';

describe('SearchResultWrapper', () => {
  it('shows a spinner while loading', () => {
    render(
      <SearchResultWrapper isLoading>
        <p>Content</p>
      </SearchResultWrapper>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Content')).not.toBeInTheDocument();
  });

  it('shows an error alert with a retry action when isError is true', async () => {
    const user = userEvent.setup();
    const onRetry = jest.fn();

    render(
      <SearchResultWrapper isLoading={false} isError errorMessage="Could not reach the API" onRetry={onRetry}>
        <p>Content</p>
      </SearchResultWrapper>
    );

    expect(screen.getByText('Could not reach the API')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('does not render a retry action when onRetry is not provided', () => {
    render(
      <SearchResultWrapper isLoading={false} isError errorMessage="Could not reach the API">
        <p>Content</p>
      </SearchResultWrapper>
    );

    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  it('shows an empty state message when isEmpty is true', () => {
    render(
      <SearchResultWrapper isLoading={false} isEmpty emptyMessage="No requests match your filters.">
        <p>Content</p>
      </SearchResultWrapper>
    );

    expect(screen.getByText('No requests match your filters.')).toBeInTheDocument();
  });

  it('renders children when loaded, without error, and not empty', () => {
    render(
      <SearchResultWrapper isLoading={false}>
        <p>Content</p>
      </SearchResultWrapper>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
