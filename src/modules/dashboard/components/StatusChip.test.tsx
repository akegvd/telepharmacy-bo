import { render, screen } from '@testing-library/react';

import StatusChip from './StatusChip';

describe('StatusChip', () => {
  it.each([
    ['New', 'info'],
    ['In progress', 'warning'],
    ['Completed', 'success'],
  ] as const)('renders the label %s with the %s color', (label, color) => {
    render(<StatusChip label={label} color={color} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders the raw value as an outlined chip when no color is provided', () => {
    render(<StatusChip label="pending_review" />);

    expect(screen.getByText('pending_review')).toBeInTheDocument();
  });

  it('falls back to a generic label when the label is blank and no color is provided', () => {
    render(<StatusChip label="" />);

    expect(screen.getByText('Unrecognized')).toBeInTheDocument();
  });

  it('matches snapshot for each known color', () => {
    const chips = [
      { label: 'New', color: 'info' },
      { label: 'In progress', color: 'warning' },
      { label: 'Completed', color: 'success' },
    ] as const;

    chips.forEach(({ label, color }) => {
      const { container, unmount } = render(<StatusChip label={label} color={color} />);
      expect(container).toMatchSnapshot(color);
      unmount();
    });
  });
});
