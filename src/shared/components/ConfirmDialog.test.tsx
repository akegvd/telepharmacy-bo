import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ConfirmDialog from './ConfirmDialog';

describe('ConfirmDialog', () => {
  it('renders nothing visible when closed', () => {
    render(
      <ConfirmDialog
        open={false}
        title="Advance this request?"
        confirmLabel="Confirm"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.queryByText('Advance this request?')).not.toBeInTheDocument();
  });

  it('shows the title and description when open', () => {
    render(
      <ConfirmDialog
        open
        title="Advance this request?"
        description="This cannot be undone."
        confirmLabel="Confirm"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByText('Advance this request?')).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
  });

  it('renders a default confirmation icon when none is provided', () => {
    render(
      <ConfirmDialog
        open
        title="Advance this request?"
        confirmLabel="Confirm"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByTestId('ErrorOutlineOutlinedIcon')).toBeInTheDocument();
  });

  it('renders a custom icon when provided', () => {
    render(
      <ConfirmDialog
        open
        title="Advance this request?"
        confirmLabel="Confirm"
        icon={<span data-testid="custom-icon" />}
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('ErrorOutlineOutlinedIcon')).not.toBeInTheDocument();
  });

  it('calls onExited after the close transition finishes', async () => {
    const onExited = jest.fn();
    const { rerender } = render(
      <ConfirmDialog
        open
        title="Advance this request?"
        confirmLabel="Confirm"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
        onExited={onExited}
      />
    );

    rerender(
      <ConfirmDialog
        open={false}
        title="Advance this request?"
        confirmLabel="Confirm"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
        onExited={onExited}
      />
    );

    await waitFor(() => expect(onExited).toHaveBeenCalledTimes(1));
  });

  it('calls onConfirm when the confirm button is clicked', async () => {
    const user = userEvent.setup();
    const onConfirm = jest.fn();
    render(
      <ConfirmDialog
        open
        title="Advance this request?"
        confirmLabel="Confirm"
        onCancel={jest.fn()}
        onConfirm={onConfirm}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when the cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        open
        title="Advance this request?"
        confirmLabel="Confirm"
        onCancel={onCancel}
        onConfirm={jest.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when dismissed with Escape', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        open
        title="Advance this request?"
        confirmLabel="Confirm"
        onCancel={onCancel}
        onConfirm={jest.fn()}
      />
    );

    await user.keyboard('{Escape}');

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onCancel when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        open
        title="Advance this request?"
        confirmLabel="Confirm"
        onCancel={onCancel}
        onConfirm={jest.fn()}
      />
    );

    await user.click(document.querySelector('.MuiBackdrop-root') as HTMLElement);

    expect(onCancel).not.toHaveBeenCalled();
  });

  it('uses a custom cancel label when provided', () => {
    render(
      <ConfirmDialog
        open
        title="Advance this request?"
        confirmLabel="Confirm"
        cancelLabel="Not now"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument();
  });
});
