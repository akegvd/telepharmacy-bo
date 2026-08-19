import { withQueryClient } from '@/shared/mocks/storyQueryClient';

import { ChatPanel } from './ChatPanel';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ChatPanel> = {
  component: ChatPanel,
  title: 'Chat/ChatPanel',
  // No mock API in Storybook — the mutation is never actually triggered from these stories.
  decorators: [withQueryClient(() => {})],
};

export default meta;
type Story = StoryObj<typeof ChatPanel>;

export const Empty: Story = {};
