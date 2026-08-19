import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';

import ServiceTypeIcon from './ServiceTypeIcon';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof ServiceTypeIcon> = {
  component: ServiceTypeIcon,
  title: 'Dashboard/ServiceTypeIcon',
};

export default meta;
type Story = StoryObj<typeof ServiceTypeIcon>;

export const VideoCall: Story = {
  args: { serviceType: SERVICE_TYPE.VIDEO_CALL },
};

export const VoiceCall: Story = {
  args: { serviceType: SERVICE_TYPE.VOICE_CALL },
};

export const Chat: Story = {
  args: { serviceType: SERVICE_TYPE.CHAT },
};

export const Unknown: Story = {
  args: { serviceType: 'unknown' },
};
