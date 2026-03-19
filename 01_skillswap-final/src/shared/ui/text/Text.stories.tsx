import type { Meta, StoryObj } from '@storybook/react';
import { Text, type TextVariant } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'body', 'caption'] satisfies TextVariant[],
      description: 'Типографическая вариация текста',
    },
    children: {
      control: 'text',
      description: 'Содержимое текста',
    },
    as: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Example: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '20px' }}>
      <Text variant='h1'>Заголовок H1 — Jost, 32px, 500</Text>
      <Text variant='h2'>Заголовок H2 — Jost, 24px, 500</Text>
      <Text variant='h3'>Заголовок H3 — Jost, 20px, 500</Text>
      <Text variant='h4'>Заголовок H4 — Roboto, 16px, 500</Text>
      <Text variant='body'>Основной текст — Roboto, 16px, 400</Text>
      <Text variant='caption'>Подпись — Roboto, 12px, 400</Text>
    </div>
  ),
};
