import { ServiceTypeIcon } from "./ServiceTypeIcon";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";


const meta: Meta<typeof ServiceTypeIcon> = {
  component: ServiceTypeIcon,
  title: "Dashboard/ServiceTypeIcon",
};

export default meta;
type Story = StoryObj<typeof ServiceTypeIcon>;

export const VideoCall: Story = {
  args: { serviceType: "video_call" },
};

export const VoiceCall: Story = {
  args: { serviceType: "voice_call" },
};

export const Chat: Story = {
  args: { serviceType: "chat" },
};

export const Unknown: Story = {
  args: { serviceType: "unknown" },
};
