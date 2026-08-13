import { makeTask } from "../mocks/taskFixtures";

import { SummaryBar } from "./SummaryBar";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";


const meta: Meta<typeof SummaryBar> = {
  component: SummaryBar,
  title: "Dashboard/SummaryBar",
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
