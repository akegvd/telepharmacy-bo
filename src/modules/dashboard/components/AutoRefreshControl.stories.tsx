import AutoRefreshControl from './AutoRefreshControl';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof AutoRefreshControl> = {
  component: AutoRefreshControl,
  title: 'Dashboard/AutoRefreshControl',
  args: {
    isPaused: false,
    isRefreshing: false,
    dataUpdatedAt: Date.now(),
    intervalMs: 15_000,
  },
};

export default meta;
type Story = StoryObj<typeof AutoRefreshControl>;

export const Active: Story = {};

export const Paused: Story = {
  args: { isPaused: true },
};

export const Refreshing: Story = {
  args: { isRefreshing: true },
};
