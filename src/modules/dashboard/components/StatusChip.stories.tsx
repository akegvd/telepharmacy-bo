import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { StatusChip } from './StatusChip';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof StatusChip> = {
  component: StatusChip,
  title: 'Dashboard/StatusChip',
};

export default meta;
type Story = StoryObj<typeof StatusChip>;

export const New: Story = {
  args: { status: TASK_STATUS.NEW },
};

export const InProgress: Story = {
  args: { status: TASK_STATUS.IN_PROGRESS },
};

export const Completed: Story = {
  args: { status: TASK_STATUS.COMPLETED },
};

export const Unrecognized: Story = {
  args: { status: 'pending_review' },
};
