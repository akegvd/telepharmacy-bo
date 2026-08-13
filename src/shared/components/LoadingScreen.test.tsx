import { render, screen } from '@testing-library/react';

import { LoadingScreen } from './LoadingScreen';

describe('LoadingScreen', () => {
  it('renders a full-screen loading indicator', () => {
    render(<LoadingScreen />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });
});
