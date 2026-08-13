import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { withQueryClient } from '@/shared/mocks/storyQueryClient';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';

import TaskCard from './TaskCard';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof TaskCard> = {
  component: TaskCard,
  title: 'Dashboard/TaskCard',
  decorators: [
    withQueryClient(() => {}),
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const New: Story = {
  args: { task: makeTask({ customerName: 'Somchai P.', status: TASK_STATUS.NEW }) },
};

export const InProgress: Story = {
  args: {
    task: makeTask({
      customerName: 'Nutcha R.',
      status: TASK_STATUS.IN_PROGRESS,
      serviceType: SERVICE_TYPE.VOICE_CALL,
    }),
  },
};

export const Completed: Story = {
  args: {
    task: makeTask({ customerName: 'Areeya K.', status: TASK_STATUS.COMPLETED, serviceType: SERVICE_TYPE.CHAT }),
  },
};

export const WithDataIssue: Story = {
  args: {
    task: makeTask({
      customerName: 'Unknown customer',
      issues: [DATA_ISSUE.MISSING_NAME, DATA_ISSUE.INVALID_DATE],
    }),
  },
};
