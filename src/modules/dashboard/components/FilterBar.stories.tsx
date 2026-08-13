import { useArgs } from 'storybook/preview-api';

import FilterBar from './FilterBar';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof FilterBar> = {
  component: FilterBar,
  title: 'Dashboard/FilterBar',
  args: {
    search: '',
    service: 'all',
    status: 'all',
    createdFrom: '',
    createdTo: '',
  },
  render: (args) => {
    const [, updateArgs] = useArgs();
    return (
      <FilterBar
        {...args}
        onSearchChange={(search) => updateArgs({ search })}
        onServiceChange={(service) => updateArgs({ service })}
        onStatusChange={(status) => updateArgs({ status })}
        onCreatedFromChange={(createdFrom) => updateArgs({ createdFrom })}
        onCreatedToChange={(createdTo) => updateArgs({ createdTo })}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof FilterBar>;

export const Default: Story = {};

export const WithActiveFilters: Story = {
  args: {
    search: 'Somchai',
    service: 'video_call',
    status: 'in_progress',
    createdFrom: '2026-08-01',
    createdTo: '2026-08-15',
  },
};
