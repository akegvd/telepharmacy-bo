import { makeTask } from '../mocks/taskFixtures';

import { DataIssuesBanner } from './DataIssuesBanner';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof DataIssuesBanner> = {
  component: DataIssuesBanner,
  title: 'Dashboard/DataIssuesBanner',
};

export default meta;
type Story = StoryObj<typeof DataIssuesBanner>;

export const Hidden: Story = {
  args: { tasks: [makeTask({ issues: [] })], duplicateIds: [] },
};

export const FlaggedRecords: Story = {
  args: {
    tasks: [
      makeTask({ id: '1', issues: ['missing_name'] }),
      makeTask({ id: '2', issues: ['invalid_date'] }),
      makeTask({ id: '3', issues: [] }),
    ],
    duplicateIds: [],
  },
};

export const DuplicateIds: Story = {
  args: {
    tasks: [makeTask({ id: '1' }), makeTask({ id: '1' })],
    duplicateIds: ['1'],
  },
};

export const Both: Story = {
  args: {
    tasks: [makeTask({ id: '1', issues: ['missing_symptom'] }), makeTask({ id: '2' })],
    duplicateIds: ['2'],
  },
};
