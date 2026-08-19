import { withQueryClient } from '@/shared/mocks/storyQueryClient';

import { ChatLauncherButton } from './ChatLauncherButton';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ChatLauncherButton> = {
  component: ChatLauncherButton,
  title: 'Chat/ChatLauncherButton',
  // No mock API in Storybook — the mutation is never actually triggered from this story.
  decorators: [withQueryClient(() => {})],
};

export default meta;
type Story = StoryObj<typeof ChatLauncherButton>;

export const Default: Story = {};
