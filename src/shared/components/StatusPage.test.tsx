import { render, screen } from '@testing-library/react';

import { StatusPage } from './StatusPage';

describe('StatusPage', () => {
  it('renders the title, description, and icon', () => {
    render(
      <StatusPage
        icon={<span data-testid="status-icon" />}
        title="Page not found"
        description="This page does not exist."
      />
    );

    expect(screen.getByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByText('This page does not exist.')).toBeInTheDocument();
    expect(screen.getByTestId('status-icon')).toBeInTheDocument();
  });

  it('renders an optional status code', () => {
    render(<StatusPage icon={<span />} code="404" title="Page not found" description="This page does not exist." />);

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders optional detail text and actions', () => {
    render(
      <StatusPage
        icon={<span />}
        title="Something went wrong"
        description="Please try again."
        detail="Reference: abc123"
      >
        <button type="button">Try again</button>
      </StatusPage>
    );

    expect(screen.getByText('Reference: abc123')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
