import { FilterBar } from "./FilterBar";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";


const meta: Meta<typeof FilterBar> = {
  component: FilterBar,
  title: "Dashboard/FilterBar",
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
