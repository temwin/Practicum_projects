import type { Meta, StoryObj } from '@storybook/react';
import { Datepicker } from '.';
import { useState } from 'react';

const meta: Meta<typeof Datepicker> = {
  title: 'Components/Datepicker',
  component: Datepicker,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', maxWidth: '210px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Datepicker>;

export const Example: Story = {
  render: (args) => {
    const [date, setDate] = useState<Date | null>(null); // ← Date | null
    return <Datepicker {...args} value={date} onChange={setDate} />;
  },
  args: {
    label: 'Дата рождения',
    placeholder: 'дд.мм.гггг',
  },
};
