import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from './RadioButton';
import { useState } from 'react';

const meta: Meta<typeof RadioButton> = {
  title: 'Components/RadioButton',
  component: RadioButton,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RadioButton>;

export const Example: Story = {
  render: () => {
    const [selected, setSelected] = useState('option1');

    const options = [
      { value: 'option1', label: 'Вариант 1' },
      { value: 'option2', label: 'Вариант 2' },
      { value: 'option3', label: 'Вариант 3' },
    ];

    return (
      <>
        {options.map((option) => (
          <RadioButton
            key={option.value}
            value={option.value}
            label={option.label}
            checked={selected === option.value}
            onChange={setSelected}
          />
        ))}
      </>
    );
  },
};
