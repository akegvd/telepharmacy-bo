import { Box } from '@mui/material';

import TASK_STATUS from '@/shared/enums/api/tasks/status';

import DATA_ISSUE from '../enums/dataIssue';
import { makeTask } from '../mocks/taskFixtures';
import { buildTaskListSummary } from '../utils/transforms/transformTaskListResponse';

import SummaryBar from './SummaryBar';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof SummaryBar> = {
  component: SummaryBar,
  title: 'Dashboard/SummaryBar',
};

export default meta;
type Story = StoryObj<typeof SummaryBar>;

export const Mixed: Story = {
  args: {
    summary: buildTaskListSummary([
      makeTask({ id: '1', status: TASK_STATUS.NEW }),
      makeTask({ id: '2', status: TASK_STATUS.NEW }),
      makeTask({ id: '3', status: TASK_STATUS.IN_PROGRESS }),
      makeTask({ id: '4', status: TASK_STATUS.COMPLETED }),
      makeTask({ id: '5', status: TASK_STATUS.COMPLETED }),
      makeTask({ id: '6', status: TASK_STATUS.COMPLETED }),
    ]),
  },
};

export const Empty: Story = {
  args: { summary: buildTaskListSummary([]) },
};

export const WithFlaggedData: Story = {
  args: {
    summary: buildTaskListSummary([
      makeTask({ id: '1', status: TASK_STATUS.NEW }),
      makeTask({ id: '2', status: TASK_STATUS.NEW, issues: [DATA_ISSUE.MISSING_NAME] }),
      makeTask({ id: '3', status: TASK_STATUS.COMPLETED, issues: [DATA_ISSUE.INVALID_DATE] }),
    ]),
  },
};

export const Mobile: Story = {
  args: Mixed.args,
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 360 }}>
        <Story />
      </Box>
    ),
  ],
};
