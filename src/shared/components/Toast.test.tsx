import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomContentProps, useSnackbar } from 'notistack';

import Toast from './Toast';

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(),
}));

const mockUseSnackbar = jest.mocked(useSnackbar);
const mockCloseSnackbar = jest.fn();

const baseProps: CustomContentProps = {
  id: 'toast-1',
  message: 'Status updated.',
  variant: 'default',
  hideIconVariant: false,
  iconVariant: {},
  anchorOrigin: { vertical: 'top', horizontal: 'right' },
  persist: false,
  style: {},
};

describe('Toast', () => {
  beforeEach(() => {
    mockCloseSnackbar.mockReset();
    mockUseSnackbar.mockReturnValue({
      closeSnackbar: mockCloseSnackbar,
    } as unknown as ReturnType<typeof useSnackbar>);
  });

  it('renders the message', () => {
    render(<Toast {...baseProps} />);

    expect(screen.getByText('Status updated.')).toBeInTheDocument();
  });

  it.each([
    ['success', 'MuiAlert-colorSuccess'],
    ['error', 'MuiAlert-colorError'],
    ['warning', 'MuiAlert-colorWarning'],
    ['info', 'MuiAlert-colorInfo'],
    ['default', 'MuiAlert-colorInfo'],
  ] as const)('maps notistack variant "%s" to the matching alert severity', (variant, expectedClass) => {
    render(<Toast {...baseProps} variant={variant} />);

    expect(screen.getByRole('alert')).toHaveClass(expectedClass);
  });

  it('closes the snackbar via notistack when the close button is clicked', async () => {
    const user = userEvent.setup();
    render(<Toast {...baseProps} />);

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(mockCloseSnackbar).toHaveBeenCalledWith('toast-1');
  });
});
