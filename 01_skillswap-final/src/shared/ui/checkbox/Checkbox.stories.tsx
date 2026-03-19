import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';
import { useState } from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '300px',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Example: Story = {
  render: () => {
    const [state, setState] = useState<'empty' | 'checked' | 'indeterminate'>('empty');
    return <Checkbox state={state} onChange={setState} label='Пустой чекбокс' />;
  },
};

export const Indeterminate: Story = {
  render: () => {
    const [state, setState] = useState<'empty' | 'checked' | 'indeterminate'>('indeterminate');
    return <Checkbox state={state} onChange={setState} label='Частично выбранный' />;
  },
};

export const Expandable: Story = {
  render: () => {
    const [checkboxState, setCheckboxState] = useState<'empty' | 'checked' | 'indeterminate'>(
      'checked'
    );
    const [expanded, setExpanded] = useState(false);

    return (
      <Checkbox
        state={checkboxState}
        onChange={setCheckboxState}
        label='Родительский элемент'
        onToggleExpand={() => setExpanded(!expanded)}
        isExpanded={expanded}
      />
    );
  },
};
