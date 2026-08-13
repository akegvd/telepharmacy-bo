import { StatusChip } from './StatusChip';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof StatusChip> = {
  component: StatusChip,
  title: 'Dashboard/StatusChip',
};

export default meta;
type Story = StoryObj<typeof StatusChip>;

export const New: Story = {
  args: { status: 'new' },
};

export const InProgress: Story = {
  args: { status: 'in_progress' },
};

export const Completed: Story = {
  args: { status: 'completed' },
};
