import type { Meta, StoryObj } from '@storybook/react';
import FiltersPanel from './FiltersPanel';

const DEFAULT_VALUE = {
  skillType: 'all',
  gender: 'all',
  selectedSkills: [],
  selectedCities: [],
};

const meta: Meta<typeof FiltersPanel> = {
  title: 'Widgets/FiltersPanel',
  component: FiltersPanel,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FiltersPanel>;

export const Default: Story = {
  args: {
    value: DEFAULT_VALUE,
    onChange: () => {},
  },
};
