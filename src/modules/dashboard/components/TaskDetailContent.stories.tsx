import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';
import { withQueryClient } from '@/shared/mocks/storyQueryClient';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';

import { TaskDetailContent } from './TaskDetailContent';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const seeded = (id: string, overrides: Parameters<typeof makeTask>[0] = {}) => {
  return withQueryClient((queryClient) => {
    queryClient.setQueryData(taskKeys.detail(id), makeTask({ id, ...overrides }));
    // No mock API in Storybook — keep the seeded data as-is instead of refetching.
    queryClient.setQueryDefaults(taskKeys.detail(id), { enabled: false });
  });
};

const meta: Meta<typeof TaskDetailContent> = {
  component: TaskDetailContent,
  title: 'Dashboard/TaskDetailContent',
  parameters: {
    layout: 'centered',
  },
  decorators: [
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
  args: { id: '1' },
  decorators: [seeded('1', { status: TASK_STATUS.NEW })],
};

export const InProgress: Story = {
  args: { id: '2' },
  decorators: [seeded('2', { status: TASK_STATUS.IN_PROGRESS })],
};

export const Completed: Story = {
  args: { id: '3' },
  decorators: [seeded('3', { status: TASK_STATUS.COMPLETED })],
};

export const WithDataIssue: Story = {
  args: { id: '4' },
  decorators: [
    seeded('4', {
      customerName: '',
      displayCustomerName: '',
      displayCreatedAt: null,
      issues: [DATA_ISSUE.MISSING_NAME, DATA_ISSUE.INVALID_DATE],
    }),
  ],
};

export const UnrecognizedStatus: Story = {
  args: { id: '5' },
  decorators: [
    seeded('5', {
      status: 'pending_review',
      displayStatus: 'pending_review',
      issues: [DATA_ISSUE.UNKNOWN_STATUS],
    }),
  ],
};

export const NotFound: Story = {
  args: { id: 'missing' },
  decorators: [withQueryClient((qc) => qc.setQueryDefaults(taskKeys.detail('missing'), { enabled: false }))],
};
