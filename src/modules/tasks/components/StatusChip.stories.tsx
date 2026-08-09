import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StatusChip } from "./StatusChip";

const meta: Meta<typeof StatusChip> = {
  component: StatusChip,
  title: "Tasks/StatusChip",
};

export default meta;
type Story = StoryObj<typeof StatusChip>;

export const New: Story = {
  args: { status: "new" },
};

export const InProgress: Story = {
  args: { status: "in_progress" },
};

export const Completed: Story = {
  args: { status: "completed" },
};
