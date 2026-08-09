import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TaskList } from "./TaskList";
import { makeTask } from "../test-utils/taskFixtures";

const meta: Meta<typeof TaskList> = {
  component: TaskList,
  title: "Tasks/TaskList",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TaskList>;

export const FewTasks: Story = {
  args: {
    tasks: [
      makeTask({ id: "1", customerName: "Somchai P.", status: "new" }),
      makeTask({ id: "2", customerName: "Nutcha R.", status: "in_progress", serviceType: "voice_call" }),
      makeTask({ id: "3", customerName: "Areeya K.", status: "completed", serviceType: "chat" }),
    ],
  },
};

export const ManyTasks: Story = {
  name: "Many tasks (virtualized)",
  args: {
    tasks: Array.from({ length: 500 }, (_, index) =>
      makeTask({
        id: String(index),
        customerName: `Customer ${index}`,
        status: (["new", "in_progress", "completed"] as const)[index % 3],
      }),
    ),
  },
};

export const Empty: Story = {
  args: { tasks: [] },
};
