import type { Meta, StoryObj } from '@storybook/react';
import { Multiselect } from '.';
import { useState } from 'react';

const meta: Meta<typeof Multiselect> = {
  title: 'Components/Multiselect',
  component: Multiselect,
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

type Story = StoryObj<typeof Multiselect>;

export const Categories: Story = {
  render: () => {
    const [selected, setSelected] = useState<number[]>([]);
    return (
      <Multiselect
        label='Категории'
        categoriesUrl='/db/category.json'
        placeholder='Выберите категории'
        selectedIds={selected}
        onSelectionChange={setSelected}
      />
    );
  },
};

export const Subcategories: Story = {
  render: () => {
    const [selected, setSelected] = useState<number[]>([]);
    return (
      <Multiselect
        label='Подкатегории'
        subcategoriesUrl='/db/subcategories.json'
        categoryId={1}
        placeholder='Выберите подкатегории'
        selectedIds={selected}
        onSelectionChange={setSelected}
      />
    );
  },
};

export const SubcategoriesFromMulticategories: Story = {
  render: () => {
    const [selected, setSelected] = useState<number[]>([]);
    return (
      <Multiselect
        label='Подкатегории'
        subcategoriesUrl='/db/subcategories.json'
        categoryId={[1, 2, 3]}
        placeholder='Выберите подкатегории'
        selectedIds={selected}
        onSelectionChange={setSelected}
      />
    );
  },
};
