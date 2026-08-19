import TaskListViewToggle from './TaskListViewToggle';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof TaskListViewToggle> = {
  component: TaskListViewToggle,
  title: 'Dashboard/TaskListViewToggle',
  args: {
    onChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof TaskListViewToggle>;

export const Table: Story = {
  args: { value: 'table' },
};

export const Grid: Story = {
  args: { value: 'grid' },
};
