import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const back = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ back }),
}));

import { Modal } from './Modal';

describe('Modal', () => {
  beforeEach(() => {
    back.mockClear();
  });

  it('renders its children', () => {
    render(
      <Modal>
        <p>Task detail</p>
      </Modal>
    );

    expect(screen.getByText('Task detail')).toBeInTheDocument();
  });

  it('navigates back when the close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <p>Task detail</p>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(back).toHaveBeenCalledTimes(1);
  });

  it('navigates back when the dialog is dismissed (e.g. Escape / backdrop)', async () => {
    const user = userEvent.setup();
    render(
      <Modal>
        <p>Task detail</p>
      </Modal>
    );

    await user.keyboard('{Escape}');

    expect(back).toHaveBeenCalledTimes(1);
  });
});
