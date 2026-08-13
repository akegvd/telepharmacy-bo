import ConfirmDialog from './ConfirmDialog';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ConfirmDialog> = {
  component: ConfirmDialog,
  title: 'Shared/ConfirmDialog',
  args: {
    open: true,
    title: 'Advance this request to In progress?',
    confirmLabel: 'Confirm',
    onCancel: () => {},
    onConfirm: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    description: 'The customer will be notified that their request is now in progress.',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const CustomCancelLabel: Story = {
  args: {
    cancelLabel: 'Not now',
  },
};

export const CustomIcon: Story = {
  args: {
    icon: (
      <span role="img" aria-label="custom icon">
        ✓
      </span>
    ),
  },
};
