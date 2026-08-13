import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';
import { taskKeys } from '@/shared/hooks/api/tasks/taskKeys';
import { withQueryClient } from '@/shared/mocks/storyQueryClient';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';
import { ITransformTaskItemResponse } from '../types/utils/transforms/transformTaskListResponse';
import { buildTaskListSummary } from '../utils/transforms/transformTaskListResponse';

import Dashboard from './Dashboard';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const seededDashboard = (taskList: ITransformTaskItemResponse[], params?: Parameters<typeof taskKeys.list>[0]) =>
  withQueryClient((queryClient) => {
    queryClient.setQueryData(taskKeys.list(params), { taskList, summary: buildTaskListSummary(taskList) });
    // No mock API in Storybook — keep the seeded data as-is instead of
    // refetching (also prevents the real 15s poll from firing here).
    queryClient.setQueryDefaults(taskKeys.list(params), { enabled: false });
  });

const meta: Meta<typeof Dashboard> = {
  component: Dashboard,
  title: 'Dashboard/Dashboard',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dashboard>;

export const Populated: Story = {
  decorators: [
    seededDashboard([
      makeTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
      makeTask({
        id: '2',
        customerName: 'Nutcha R.',
        status: TASK_STATUS.IN_PROGRESS,
        serviceType: SERVICE_TYPE.VOICE_CALL,
      }),
      makeTask({ id: '3', customerName: 'Areeya K.', status: TASK_STATUS.COMPLETED, serviceType: SERVICE_TYPE.CHAT }),
    ]),
  ],
};

export const Empty: Story = {
  decorators: [seededDashboard([])],
};

export const WithDataIssues: Story = {
  decorators: [
    seededDashboard([
      makeTask({ id: '1', customerName: '', displayCustomerName: '', issues: [DATA_ISSUE.MISSING_NAME] }),
      makeTask({ id: '2', issues: [DATA_ISSUE.INVALID_DATE] }),
    ]),
  ],
};

export const FilteredByStatus: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        query: { status: 'new' },
      },
    },
  },
  decorators: [
    // Seeded as the API would already return it filtered server-side for `status=new`.
    seededDashboard([makeTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW })], {
      status: TASK_STATUS.NEW,
    }),
  ],
};
