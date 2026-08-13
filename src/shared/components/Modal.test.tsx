import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from './Modal';

describe('Modal', () => {
  it('renders its children', () => {
    render(
      <Modal onClose={jest.fn()}>
        <p>Task detail</p>
      </Modal>
    );

    expect(screen.getByText('Task detail')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    render(
      <Modal onClose={onClose}>
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
      <Modal onClose={onClose}>
        <p>Task detail</p>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
