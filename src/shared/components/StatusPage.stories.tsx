import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Button } from '@mui/material';

import StatusPage from './StatusPage';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof StatusPage> = {
  component: StatusPage,
  title: 'Shared/StatusPage',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof StatusPage>;

export const Default: Story = {
  args: {
    icon: <SearchOffIcon sx={{ fontSize: 48 }} />,
    code: '404',
    title: 'Page not found',
    description: 'The page you are looking for does not exist or may have been moved.',
    children: <Button variant="contained">Back to Dashboard</Button>,
  },
};

export const ErrorTone: Story = {
  args: {
    tone: 'error',
    icon: <ErrorOutlineOutlinedIcon sx={{ fontSize: 48 }} />,
    title: 'Something went wrong',
    description: 'An unexpected error occurred. You can try again, or return to the dashboard.',
    detail: 'Reference: abc123',
    children: (
      <Button variant="contained" color="error">
        Try again
      </Button>
    ),
  },
};
