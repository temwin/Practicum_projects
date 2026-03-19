import type { Meta, StoryObj } from '@storybook/react';
import { RegistrationStep3Modal } from './RegistrationStep3Modal';
import type { SkillType } from '../../widgets/SkillDescription/SkillDescription';

// Пример данных навыка
const mockSkill: SkillType = {
  id: 1,
  name: 'Веб‑разработка на React',
  description:
    'Создаю интерактивные пользовательские интерфейсы с использованием React, TypeScript и современных подходов к архитектуре фронтенда. Опыт — 5 лет.',
  category: 'Программирование',
  subcategory: 'Frontend',
  images: [
    'https://example.com/img1.jpg',
    'https://example.com/img2.jpg',
  ],
  userId: 123,
};

const meta: Meta<typeof RegistrationStep3Modal> = {
  title: 'Widgets/RegistrationStep3Modal',
  component: RegistrationStep3Modal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Открыт ли модальный окон',
    },
    onClose: {
      action: 'onClose',
      description: 'Обработчик закрытия модального окна',
    },
    onConfirm: {
      action: 'onConfirm',
      description: 'Обработчик подтверждения (кнопка "Готово")',
    },
    onEdit: {
      action: 'onEdit',
      description: 'Обработчик перехода в режим редактирования',
    },
    skill: {
      description: 'Объект навыка, передаваемый в SkillDescription',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RegistrationStep3Modal>;

// Базовая история: модальное окно открыто
export const Open: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
    onEdit: () => {},
    skill: mockSkill,
  },
};

// История: окно закрыто (ничего не отображается)
export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    onConfirm: () => {},
    onEdit: () => {},
    skill: mockSkill,
  },
};

// История: с длинным описанием навыка (проверка переполнения и скролла)
export const WithLongDescription: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
    onEdit: () => {},
    skill: {
      ...mockSkill,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
        'Suspendisse potenti. Vivamus euismod, nisl a efficitur tincidunt, ' +
        'nunc nisl aliquam nunc, nec ultricies nunc nisl eget nunc. ' +
        'Donec euismod, nisl a efficitur tincidunt, nunc nisl aliquam nunc, ' +
        'nec ultricies nunc nisl eget nunc. Sed do eiusmod tempor incididunt ' +
        'ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    },
  },
};

// История: без изображений (проверка отображения без слайдера)
export const WithoutImages: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onConfirm: () => {},
    onEdit: () => {},
    skill: {
      ...mockSkill,
      images: [], // Нет изображений
    },
  },
};
