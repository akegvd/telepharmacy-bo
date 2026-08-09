import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FilterBar } from "./FilterBar";

const meta: Meta<typeof FilterBar> = {
  component: FilterBar,
  title: "Tasks/FilterBar",
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {};

export const WithActiveFilters: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        query: { q: "Somchai", service: "video_call", status: "in_progress" },
      },
    },
  },
};
