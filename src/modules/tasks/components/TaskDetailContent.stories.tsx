import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TaskDetailContent } from "./TaskDetailContent";
import { taskKeys } from "../hooks/useTaskQueries";
import { makeTask } from "../test-utils/taskFixtures";
import { withQueryClient } from "../test-utils/storyQueryClient";

function seeded(id: string, overrides: Parameters<typeof makeTask>[0] = {}) {
  return withQueryClient((queryClient) => {
    queryClient.setQueryData(taskKeys.detail(id), makeTask({ id, ...overrides }));
    // No mock API in Storybook — keep the seeded data as-is instead of refetching.
    queryClient.setQueryDefaults(taskKeys.detail(id), { enabled: false });
  });
}

const meta: Meta<typeof TaskDetailContent> = {
  component: TaskDetailContent,
  title: "Tasks/TaskDetailContent",
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskDetailContent>;

export const New: Story = {
  args: { id: "1" },
  decorators: [seeded("1", { status: "new" })],
};

export const InProgress: Story = {
  args: { id: "2" },
  decorators: [seeded("2", { status: "in_progress" })],
};

export const Completed: Story = {
  args: { id: "3" },
  decorators: [seeded("3", { status: "completed" })],
};

export const WithDataIssue: Story = {
  args: { id: "4" },
  decorators: [
    seeded("4", {
      customerName: "Unknown customer",
      issues: ["missing_name", "invalid_date"],
    }),
  ],
};

export const NotFound: Story = {
  args: { id: "missing" },
  decorators: [withQueryClient((qc) => qc.setQueryDefaults(taskKeys.detail("missing"), { enabled: false }))],
};
