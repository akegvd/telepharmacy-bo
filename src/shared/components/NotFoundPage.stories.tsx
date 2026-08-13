import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NotFoundPage } from "./NotFoundPage";

const meta: Meta<typeof NotFoundPage> = {
  component: NotFoundPage,
  title: "Shared/NotFoundPage",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NotFoundPage>;

export const Default: Story = {};
