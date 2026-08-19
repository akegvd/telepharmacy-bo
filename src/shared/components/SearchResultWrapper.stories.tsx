import { Typography } from '@mui/material';

import SearchResultWrapper from './SearchResultWrapper';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof SearchResultWrapper> = {
  component: SearchResultWrapper,
  title: 'Shared/SearchResultWrapper',
};

export default meta;
type Story = StoryObj<typeof SearchResultWrapper>;

export const Success: Story = {
  args: {
    isLoading: false,
    children: <Typography>Result content goes here.</Typography>,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: <Typography>Result content goes here.</Typography>,
  },
};

export const ErrorState: Story = {
  args: {
    isLoading: false,
    isError: true,
    errorMessage: 'Something went wrong loading tasks.',
    onRetry: () => {},
    children: <Typography>Result content goes here.</Typography>,
  },
};

export const Empty: Story = {
  args: {
    isLoading: false,
    isEmpty: true,
    emptyMessage: 'No results found.',
    children: <Typography>Result content goes here.</Typography>,
  },
};
