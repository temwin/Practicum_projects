import type { Meta, StoryObj } from '@storybook/react';
import { CardTwoStepRegistration } from './CardTwoStepRegistration';
import type { CardTwoStepRegistrationProps } from './CardTwoStepRegistration';

// Пример данных для демонстрации
const mockData = {
  name: 'Анна Иванова',
  birthDate: '1995-03-15',
  gender: 'female',
  city: 'moscow',
  wantToLearn: [
    { name: 'Frontend-разработка', categoryId: 1, subcategoryId: 101 },
    { name: 'Backend-разработка', categoryId: 1, subcategoryId: 102 },
  ],
  avatarBase64: 'https://i.pravatar.cc/150?img=28',
};

const mockErrors = {
  wantToLearn: 'Выберите хотя бы один навык',
};

const meta: Meta<CardTwoStepRegistrationProps> = {
  title: 'components/CardTwoStepRegistration',
  component: CardTwoStepRegistration,
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Основные данные пользователя',
      control: { type: 'object' },
    },
    errors: {
      description: 'Ошибки валидации полей',
      control: { type: 'object' },
    },
    onChange: {
      description: 'Функция обновления данных формы',
      action: 'dataChanged',
    },
    onBack: {
      description: 'Обработчик кнопки "Назад"',
      action: 'backClicked',
    },
    onNext: {
      description: 'Обработчик кнопки "Далее"',
      action: 'nextClicked',
    },
  },
};

export default meta;
type Story = StoryObj<CardTwoStepRegistrationProps>;

// Базовая история — заполненная форма
export const Filled: Story = {
  args: {
    data: mockData,
    errors: {},
    onChange: () => {},
    onBack: () => {},
    onNext: () => {},
  },
};

// История — пустая форма (без данных)
export const Empty: Story = {
  args: {
    data: {},
    errors: {},
    onChange: () => {},
    onBack: undefined,
    onNext: () => {},
  },
};

// История — с ошибкой валидации
export const WithError: Story = {
  args: {
    data: { ...mockData, wantToLearn: [] },
    errors: mockErrors,
    onChange: () => {},
    onBack: () => {},
    onNext: undefined, // Кнопка "Далее" отключена
  },
};

// История — только обязательные поля (минимальный набор)
export const Minimal: Story = {
  args: {
    data: { name: 'Иван' },
    errors: {},
    onChange: () => {},
    onBack: undefined,
    onNext: () => {},
  },
};

// История — без кнопок навигации
export const NoNavigation: Story = {
  args: {
    data: mockData,
    errors: {},
    onChange: () => {},
    onBack: undefined,
    onNext: undefined,
  },
};
