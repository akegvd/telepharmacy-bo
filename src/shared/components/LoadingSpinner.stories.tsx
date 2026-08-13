import LoadingSpinner from './LoadingSpinner';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof LoadingSpinner> = {
  component: LoadingSpinner,
  title: 'Shared/LoadingSpinner',
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: 64,
  },
};

export const CustomColor: Story = {
  args: {
    color: 'secondary',
  },
};
