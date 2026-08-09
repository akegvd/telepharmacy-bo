import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Typography } from "@mui/material";

import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: "Shared/Modal",
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
    children: <Typography>Modal content goes here.</Typography>,
  },
};
