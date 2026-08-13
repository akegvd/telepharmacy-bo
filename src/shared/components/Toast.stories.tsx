import Toast from './Toast';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof Toast> = {
  component: Toast,
  title: 'Shared/Toast',
  args: {
    id: 'toast-1',
    message: 'Status updated to In progress.',
    variant: 'success',
    hideIconVariant: false,
    iconVariant: {},
    anchorOrigin: { vertical: 'top', horizontal: 'right' },
    persist: false,
    style: {},
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Success: Story = {};

export const Error: Story = {
  args: {
    message: "Couldn't update the status. Please try again.",
    variant: 'error',
  },
};

export const Warning: Story = {
  args: {
    message: 'This action may take a while.',
    variant: 'warning',
  },
};

export const Default: Story = {
  args: {
    message: 'Heads up.',
    variant: 'default',
  },
};
