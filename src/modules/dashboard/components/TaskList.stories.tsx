import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';
import TASK_STATUS from '@/shared/enums/api/tasks/status';

import { makeTask } from '../mocks/taskFixtures';

import TaskList from './TaskList';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof TaskList> = {
  component: TaskList,
  title: 'Dashboard/TaskList',
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onSelectTask: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof TaskList>;

export const FewTasks: Story = {
  args: {
    taskList: [
      makeTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
      makeTask({
        id: '2',
        customerName: 'Nutcha R.',
        status: TASK_STATUS.IN_PROGRESS,
        serviceType: SERVICE_TYPE.VOICE_CALL,
      }),
      makeTask({ id: '3', customerName: 'Areeya K.', status: TASK_STATUS.COMPLETED, serviceType: SERVICE_TYPE.CHAT }),
    ],
  },
};

export const ManyTasks: Story = {
  name: 'Many tasks (non-virtualized)',
  args: {
    taskList: Array.from({ length: 500 }, (_, index) =>
      makeTask({
        id: String(index),
        customerName: `Customer ${index}`,
        status: [TASK_STATUS.NEW, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED][index % 3],
      })
    ),
  },
};

export const Empty: Story = {
  args: { taskList: [] },
};

export const Refreshing: Story = {
  args: {
    taskList: [
      makeTask({ id: '1', customerName: 'Somchai P.', status: TASK_STATUS.NEW }),
      makeTask({ id: '2', customerName: 'Nutcha R.', status: TASK_STATUS.IN_PROGRESS }),
    ],
    isRefreshing: true,
  },
};
