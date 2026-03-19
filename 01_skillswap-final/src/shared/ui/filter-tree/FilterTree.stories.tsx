import type { Meta, StoryObj } from '@storybook/react';
import { FilterTree } from '.';

const meta: Meta<typeof FilterTree> = {
  title: 'Components/FilterTree',
  component: FilterTree,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof FilterTree>;

// Иерархический режим
export const TreeView: Story = {
  args: {
    categoryUrl: '/db/category.json',
    subcategoriesUrl: '/db/subcategories.json',
    maxVisible: 3,
    showAllText: 'Все категории',
    collapseText: 'Скрыть',
    onSelectionChange: () => {},
  },
};

export const ListView: Story = {
  args: {
    url: '/db/city.json',
    maxVisible: 5,
    showAllText: 'Все города',
    collapseText: 'Скрыть',
    onSelectionChange: () => {},
  },
};
