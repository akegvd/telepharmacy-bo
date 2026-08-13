import { Typography } from '@mui/material';

import Modal from './Modal';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'Shared/Modal',
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    open: true,
    children: <Typography>Modal content goes here.</Typography>,
    onClose: () => {},
  },
};
