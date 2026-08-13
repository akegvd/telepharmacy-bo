import { ErrorPage } from './ErrorPage';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ErrorPage> = {
  component: ErrorPage,
  title: 'Shared/ErrorPage',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const Default: Story = {
  args: {
    error: new Error('Failed to load the page'),
    reset: () => {},
  },
};

export const WithDigest: Story = {
  args: {
    error: Object.assign(new Error('Failed to load the page'), { digest: 'abc123' }),
    reset: () => {},
  },
};
