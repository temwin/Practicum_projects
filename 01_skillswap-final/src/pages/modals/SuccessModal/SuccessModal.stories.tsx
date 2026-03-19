import type { Meta, StoryObj } from '@storybook/react';
import { SuccessModal } from './SuccessModal';

const meta: Meta<typeof SuccessModal> = {
  title: 'Modals/SuccessModal',
  component: SuccessModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Открыто ли модальное окно',
      defaultValue: true,
    },
    avatarUrl: {
      control: 'text',
      description: 'URL аватара пользователя',
    },
    userName: {
      control: 'text',
      description: 'Имя пользователя',
    },
    onClose: {
      action: 'onClose',
      description: 'Обработчик закрытия модального окна',
    },
    onConfirm: {
      action: 'onConfirm',
      description: 'Обработчик подтверждения (кнопка "Готово")',
    },
  },
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f5f5' },
        { name: 'dark', value: '#333333' },
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SuccessModal>;

// Базовая история: модальное окно открыто
export const Default: Story = {
  args: {
    isOpen: true,
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    userName: 'Иван',
    onClose: () => {},
    onConfirm: () => {},
  },
};

// История: без аватара (показывается placeholder)
export const WithoutAvatar: Story = {
  args: {
    isOpen: true,
    avatarUrl: undefined,
    userName: 'Анна',
    onClose: () => {},
    onConfirm: () => {},
  },
};
