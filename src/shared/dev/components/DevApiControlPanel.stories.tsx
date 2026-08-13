import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';
import { withQueryClient } from '@/shared/mocks/storyQueryClient';

import { DevApiControlPanelContent } from './DevApiControlPanel';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

// Stories render the inner panel directly: the exported DevApiControlPanel is gated by the
// NEXT_PUBLIC_ENABLE_DEV_API_CONTROLS flag, which Storybook builds do not set.
const meta: Meta<typeof DevApiControlPanelContent> = {
  component: DevApiControlPanelContent,
  title: 'Dev/DevApiControlPanel',
};

export default meta;
type Story = StoryObj<typeof DevApiControlPanelContent>;

export const WithLoadedTaskList: Story = {
  decorators: [
    withQueryClient((queryClient) => {
      queryClient.setQueryData(taskKeys.list(), { taskList: [{ id: '1' }, { id: '2' }, { id: '3' }] });
    }),
  ],
};

export const BeforeAnyTaskListLoads: Story = {
  decorators: [withQueryClient(() => {})],
};
