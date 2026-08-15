import { ChatMessage } from './ChatMessage';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ChatMessage> = {
  component: ChatMessage,
  title: 'Chat/ChatMessage',
};

export default meta;
type Story = StoryObj<typeof ChatMessage>;

export const User: Story = {
  args: { message: { id: '1', role: 'user', content: 'How many tasks are still pending?' } },
};

export const Assistant: Story = {
  args: { message: { id: '2', role: 'assistant', content: 'There are 3 pending tasks out of 20 total.' } },
};
