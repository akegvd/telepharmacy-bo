import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { withQueryClient } from '@/shared/mocks/storyQueryClient';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';

import TaskDetailContent from './TaskDetailContent';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

// No mock API in Storybook — useUpdateTaskStatusMutation only needs a
// QueryClient to exist, it doesn't read any seeded data.
const withMutationClient = withQueryClient(() => {});

const meta: Meta<typeof TaskDetailContent> = {
  component: TaskDetailContent,
  title: 'Dashboard/TaskDetailContent',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    withMutationClient,
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TaskDetailContent>;

export const New: Story = {
  args: { task: makeTask({ id: '1', status: TASK_STATUS.NEW }) },
};

export const InProgress: Story = {
  args: { task: makeTask({ id: '2', status: TASK_STATUS.IN_PROGRESS }) },
};

export const Completed: Story = {
  args: { task: makeTask({ id: '3', status: TASK_STATUS.COMPLETED }) },
};

export const WithDataIssue: Story = {
  args: {
    task: makeTask({
      id: '4',
      customerName: '',
      displayCustomerName: '',
      displayCreatedAt: '',
      issues: [DATA_ISSUE.MISSING_NAME, DATA_ISSUE.INVALID_DATE],
    }),
  },
};

export const UnrecognizedStatus: Story = {
  args: {
    task: makeTask({
      id: '5',
      status: 'pending_review' as ITransformTaskItemResponse['status'],
      displayStatus: 'pending_review',
      issues: [DATA_ISSUE.UNKNOWN_STATUS],
    }),
  },
};
