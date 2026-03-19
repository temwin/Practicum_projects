import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardFirstStepRegistration } from './CardFirstStepRegistration';
import type { ComponentProps } from 'react';

type Story = StoryObj<ComponentProps<typeof CardFirstStepRegistration>>;

export default {
  title: 'components/CardFirstStepRegistration',
  component: CardFirstStepRegistration,
  argTypes: {
    data: {
      control: 'object',
      description: 'Данные формы (email, password)',
    },
    errors: {
      control: 'object',
      description: 'Ошибки валидации полей',
    },
    onChange: {
      action: 'onChange',
      description: 'Колбэк при изменении данных формы',
    },
    onNext: {
      action: 'onNext',
      description: 'Колбэк при нажатии кнопки "Далее"',
    },
  },
} as Meta<ComponentProps<typeof CardFirstStepRegistration>>;

// Базовый сценарий: пустая форма
export const EmptyForm: Story = {
  args: {
    data: {},
    errors: {},
    onChange: () => {},
    onNext: () => {},
  },
};

// Сценарий: заполненный email
export const WithEmail: Story = {
  args: {
    data: { email: 'test@example.com' },
    errors: {},
    onChange: () => {},
    onNext: () => {},
  },
};

// Сценарий: ошибка в email
export const EmailError: Story = {
  args: {
    data: { email: 'invalid-email' },
    errors: { email: 'Введите корректный email' },
    onChange: () => {},
    onNext: () => {},
  },
};

// Сценарий: заполненный пароль
export const WithPassword: Story = {
  args: {
    data: { password: 'secret123' },
    errors: {},
    onChange: () => {},
    onNext: () => {},
  },
};

// Сценарий: ошибка в пароле
export const PasswordError: Story = {
  args: {
    data: { password: 'short' },
    errors: { password: 'Пароль слишком короткий' },
    onChange: () => {},
    onNext: () => {},
  },
};

// Сценарий: ошибка подтверждения пароля
export const ConfirmPasswordError: Story = {
  args: {
    data: { password: 'different' },
    errors: { confirmPassword: 'Пароли не совпадают' },
    onChange: () => {},
    onNext: () => {},
  },
};

// Сценарий: полная валидация с ошибками
export const FullValidationError: Story = {
  args: {
    data: { email: 'bad-email', password: '123' },
    errors: {
      email: 'Некорректный email',
      password: 'Слишком короткий пароль',
      confirmPassword: 'Пароли не совпадают',
    },
    onChange: () => {},
    onNext: () => {},
  },
};
