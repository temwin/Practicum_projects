import type { Meta, StoryObj } from '@storybook/react';
import { Search } from '.';
import { useState } from 'react';

const meta: Meta<typeof Search> = {
  title: 'Components/Search',
  component: Search,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Текст-подсказка в поле поиска',
    },
    value: {
      control: 'text',
      description: 'Текущее значение (для демонстрации)',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Search>;

export const Example: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value || '');

    return (
      <div style={{ padding: '20px', maxWidth: '400px' }}>
        <Search value={value} onChange={setValue} placeholder={args.placeholder} />
      </div>
    );
  },
  args: {
    placeholder: 'Искать навык',
    value: '',
  },
};
