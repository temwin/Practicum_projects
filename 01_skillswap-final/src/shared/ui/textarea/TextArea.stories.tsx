import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TextArea from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Components/TextArea',
  component: TextArea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    rows: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TextArea>;

export const Example: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return <TextArea {...args} value={value} onChange={setValue} />;
  },
  args: {
    label: 'Описание',
    placeholder: 'Введите подробное описание...',
    rows: 3,
  },
};
