import { Sidebar } from './Sidebar';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof Sidebar> = {
  component: Sidebar,
  title: 'Shared/Sidebar',
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {};
