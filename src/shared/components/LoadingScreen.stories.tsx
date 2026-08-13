import { LoadingScreen } from './LoadingScreen';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof LoadingScreen> = {
  component: LoadingScreen,
  title: 'Shared/LoadingScreen',
};

export default meta;
type Story = StoryObj<typeof LoadingScreen>;

export const Default: Story = {};
