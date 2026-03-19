import type { Meta, StoryObj } from '@storybook/react';
import Button, { type IconPosition } from './Button';
import type { ButtonVariant, ButtonSize } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'] as ButtonVariant[],
      description: 'Стиль кнопки',
    },
    size: {
      control: 'radio',
      options: ['content', 'full'] satisfies ButtonSize[],
      description: 'Размер: под содержимое или на всю ширину',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключить кнопку',
    },
    hasIcon: {
      control: 'boolean',
      description: 'Иконка',
    },
    iconName: {
      control: 'text',
      description: 'Наименование иконки',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'] satisfies IconPosition[],
      description: 'Положение иконки',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Example: Story = {
  args: {
    variant: 'primary',
    children: 'Я кнопка',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'tertiary',
    children: 'Я кнопка',
    hasIcon: true,
    iconName: 'add',
    iconPosition: 'right',
  },
};
