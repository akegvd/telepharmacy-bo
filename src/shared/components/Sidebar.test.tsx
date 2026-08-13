import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

let pathname = '/';

jest.mock('next/navigation', () => ({
  usePathname: () => pathname,
}));

import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  beforeEach(() => {
    pathname = '/';
  });

  it('renders the sidebar navigation', () => {
    render(<Sidebar />);

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/');
  });

  it('marks the Dashboard nav item as selected when on the dashboard route', () => {
    pathname = '/';
    render(<Sidebar />);

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass('Mui-selected');
  });

  it('does not mark the Dashboard nav item as selected on other routes', () => {
    pathname = '/task/123';
    render(<Sidebar />);

    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveClass('Mui-selected');
  });

  it('toggles between expanded and collapsed state', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const toggleButton = screen.getByRole('button', { name: 'Collapse sidebar' });
    await user.click(toggleButton);

    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
