import { withQueryClient } from "@/shared/mocks/storyQueryClient";

import { taskKeys } from "../hooks/useTaskQueries";
import { makeTask } from "../mocks/taskFixtures";
import { ITransformTasksResponse } from "../types/utils/transforms/transformTask";

import { Dashboard } from "./Dashboard";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

function seededDashboard(result: ITransformTasksResponse) {
  return withQueryClient((queryClient) => {
    queryClient.setQueryData(taskKeys.all, result);
    // No mock API in Storybook — keep the seeded data as-is instead of
    // refetching (also prevents the real 15s poll from firing here).
    queryClient.setQueryDefaults(taskKeys.all, { enabled: false });
  });
}

const meta: Meta<typeof Dashboard> = {
  component: Dashboard,
  title: "Dashboard/Dashboard",
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Populated: Story = {
  decorators: [
    seededDashboard({
      tasks: [
        makeTask({ id: "1", customerName: "Somchai P.", status: "new" }),
        makeTask({ id: "2", customerName: "Nutcha R.", status: "in_progress", serviceType: "voice_call" }),
        makeTask({ id: "3", customerName: "Areeya K.", status: "completed", serviceType: "chat" }),
      ],
      duplicateIds: [],
    }),
  ],
};

export const Empty: Story = {
  decorators: [seededDashboard({ tasks: [], duplicateIds: [] })],
};

export const WithDataIssues: Story = {
  decorators: [
    seededDashboard({
      tasks: [
        makeTask({ id: "1", customerName: "Unknown customer", issues: ["missing_name"] }),
        makeTask({ id: "2" }),
      ],
      duplicateIds: ["2"],
    }),
  ],
};

export const FilteredByStatus: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        query: { status: "new" },
      },
    },
  },
  decorators: [
    seededDashboard({
      tasks: [
        makeTask({ id: "1", customerName: "Somchai P.", status: "new" }),
        makeTask({ id: "2", customerName: "Nutcha R.", status: "in_progress" }),
      ],
      duplicateIds: [],
    }),
  ],
};
