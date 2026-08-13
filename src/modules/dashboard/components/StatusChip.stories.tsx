import { StatusChip } from './StatusChip';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof StatusChip> = {
  component: StatusChip,
  title: 'Dashboard/StatusChip',
};

export default meta;
type Story = StoryObj<typeof StatusChip>;

export const New: Story = {
  args: { label: 'New', color: 'info' },
};

export const InProgress: Story = {
  args: { label: 'In progress', color: 'warning' },
};

export const Completed: Story = {
  args: { label: 'Completed', color: 'success' },
};

export const Unrecognized: Story = {
  args: { label: 'pending_review' },
};
