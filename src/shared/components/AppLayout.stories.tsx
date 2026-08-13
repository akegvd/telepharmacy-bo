import { Container, Typography } from '@mui/material';

import { AppLayout } from './AppLayout';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof AppLayout> = {
  component: AppLayout,
  title: 'Shared/AppLayout',
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppLayout>;

export const Default: Story = {
  args: {
    children: (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1">
          Page content
        </Typography>
      </Container>
    ),
  },
};
