import { render, screen } from '@testing-library/react';

import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders a progressbar', () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('forwards CircularProgress props such as size and color', () => {
    render(<LoadingSpinner size={64} color="secondary" />);

    const spinner = screen.getByRole('progressbar');
    expect(spinner).toHaveStyle({ width: '64px', height: '64px' });
    expect(spinner.className).toMatch(/colorSecondary/);
  });
});
