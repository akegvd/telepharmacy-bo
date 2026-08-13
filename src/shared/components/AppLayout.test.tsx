import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

import { AppLayout } from './AppLayout';

describe('AppLayout', () => {
  it('renders the sidebar navigation and the page content', () => {
    render(
      <AppLayout>
        <p>Page content</p>
      </AppLayout>
    );

    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
    expect(screen.getByText('Page content')).toBeInTheDocument();
  });
});
