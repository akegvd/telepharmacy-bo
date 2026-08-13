import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from './Modal';

describe('Modal', () => {
  it('renders its children', () => {
    render(
      <Modal open onClose={jest.fn()}>
        <p>Task detail</p>
      </Modal>
    );

    expect(screen.getByText('Task detail')).toBeInTheDocument();
  });

  it('does not render its content when closed', () => {
    render(
      <Modal open={false} onClose={jest.fn()}>
        <p>Task detail</p>
      </Modal>
    );

    expect(screen.queryByText('Task detail')).not.toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose}>
        <p>Task detail</p>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the dialog is dismissed (e.g. Escape / backdrop)', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(
      <Modal open onClose={onClose}>
        <p>Task detail</p>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onExited after the close transition finishes', async () => {
    const onExited = jest.fn();
    const { rerender } = render(
      <Modal open onClose={jest.fn()} onExited={onExited}>
        <p>Task detail</p>
      </Modal>
    );

    rerender(
      <Modal open={false} onClose={jest.fn()} onExited={onExited}>
        <p>Task detail</p>
      </Modal>
    );

    await waitFor(() => expect(onExited).toHaveBeenCalledTimes(1));
  });
});
