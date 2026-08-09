import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SummaryBar } from "./SummaryBar";
import { makeTask } from "../test-utils/taskFixtures";

const meta: Meta<typeof SummaryBar> = {
  component: SummaryBar,
  title: "Tasks/SummaryBar",
};

export default meta;
type Story = StoryObj<typeof SummaryBar>;

export const Mixed: Story = {
  args: {
    tasks: [
      makeTask({ id: "1", status: "new" }),
      makeTask({ id: "2", status: "new" }),
      makeTask({ id: "3", status: "in_progress" }),
      makeTask({ id: "4", status: "completed" }),
      makeTask({ id: "5", status: "completed" }),
      makeTask({ id: "6", status: "completed" }),
    ],
  },
};

export const Empty: Story = {
  args: { tasks: [] },
};
