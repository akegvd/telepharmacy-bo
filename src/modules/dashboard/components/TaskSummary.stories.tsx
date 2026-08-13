import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';

import TaskSummary from './TaskSummary';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof TaskSummary> = {
  component: TaskSummary,
  title: 'Dashboard/TaskSummary',
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskSummary>;

export const Detailed: Story = {
  args: {
    task: makeTask({ customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
  },
};

export const Dense: Story = {
  args: {
    task: makeTask({
      customerName: 'Nutcha R.',
      status: TASK_STATUS.IN_PROGRESS,
      serviceType: SERVICE_TYPE.VOICE_CALL,
    }),
    dense: true,
  },
};

export const WithDataIssues: Story = {
  args: {
    task: makeTask({
      customerName: 'Unknown customer',
      issues: [DATA_ISSUE.MISSING_NAME, DATA_ISSUE.INVALID_DATE],
    }),
  },
};
