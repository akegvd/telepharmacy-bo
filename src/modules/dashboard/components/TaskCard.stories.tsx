import { makeTask } from "../mocks/taskFixtures";

import { TaskCard } from "./TaskCard";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";


const meta: Meta<typeof TaskCard> = {
  component: TaskCard,
  title: "Dashboard/TaskCard",
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const New: Story = {
  args: { task: makeTask() },
};

export const InProgress: Story = {
  args: { task: makeTask({ status: "in_progress" }) },
};

export const Completed: Story = {
  args: { task: makeTask({ status: "completed" }) },
};

export const WithDataIssue: Story = {
  args: {
    task: makeTask({
      customerName: "Unknown customer",
      issues: ["missing_name"],
    }),
  },
};
