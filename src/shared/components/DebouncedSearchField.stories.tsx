import { useArgs } from 'storybook/preview-api';

import DebouncedSearchField from './DebouncedSearchField';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta<typeof DebouncedSearchField> = {
  component: DebouncedSearchField,
  title: 'Shared/DebouncedSearchField',
  args: {
    label: 'Search customer',
    placeholder: 'e.g. Somchai',
    value: '',
  },
  render: (args) => {
    const [, updateArgs] = useArgs();

    return <DebouncedSearchField {...args} onDebouncedChange={(value) => updateArgs({ value })} />;
  },
};

export default meta;
type Story = StoryObj<typeof DebouncedSearchField>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: 'Somchai',
  },
};

export const SlowDebounce: Story = {
  args: {
    debounceMs: 1500,
  },
};
