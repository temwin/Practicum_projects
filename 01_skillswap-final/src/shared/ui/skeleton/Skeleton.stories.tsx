import type { Meta, StoryObj } from '@storybook/react';
import Skeleton from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {
    rows: {
      control: 'number',
      description: 'Количество рядов карточек',
      defaultValue: 1,
      min: 1,
      max: 5,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px', background: 'var(--color-background)' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const CardsSingleRow: Story = {
  args: {
    rows: 1,
    variant: 'cards',
  },
};

export const CardsThreeRows: Story = {
  args: {
    rows: 3,
    variant: 'cards',
  },
};
