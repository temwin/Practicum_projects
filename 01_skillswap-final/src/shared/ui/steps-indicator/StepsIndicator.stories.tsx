import type { Meta, StoryObj } from '@storybook/react-vite';
import StepsIndicator from './StepsIndicator';

/**
 * Метаданные компонента для Storybook
 * Описывает параметры и поведение компонента в интерфейсе Storybook
 */
export default {
  title: 'components/StepsIndicator',
  component: StepsIndicator,
  argTypes: {
    totalSteps: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Общее количество шагов в индикаторе',
    },
    current: {
      control: { type: 'number', min: 1, step: 1 },
      description: 'Номер текущего активного шага (от 1 до totalSteps)',
    },
    customClass: {
      control: 'text',
      description: 'Дополнительные CSS‑классы для кастомизации',
    },
    activeFill: {
      control: { type: 'color' },
      description: 'Цвет заполненных (активных) шагов',
    },
    inactiveFill: {
      control: { type: 'color' },
      description: 'Цвет незаполненных (неактивных) шагов',
    },
  },
} as Meta<typeof StepsIndicator>;

/**
 * Тип для сценариев (stories)
 * Позволяет TypeScript проверять соответствие аргументов компоненту
 */
type Story = StoryObj<typeof StepsIndicator>;

/**
 * Базовый шаблон для всех сценариев
 * Принимает пропсы компонента и рендерит StepsIndicator
 */
const Template: Story['render'] = (args) => <StepsIndicator {...args} />;

// Основной сценарий: стандартный индикатор
export const Default: Story = {
  render: Template,
  args: {
    totalSteps: 5,
    current: 3,
  },
};

// Сценарий: минимальное количество шагов
export const MinimalSteps: Story = {
  render: Template,
  args: {
    totalSteps: 2,
    current: 1,
  },
};

// Сценарий: все шаги пройдены
export const AllStepsCompleted: Story = {
  render: Template,
  args: {
    totalSteps: 4,
    current: 4,
  },
};

// Сценарий: первый шаг
export const FirstStep: Story = {
  render: Template,
  args: {
    totalSteps: 3,
    current: 1,
  },
};

// Сценарий: кастомные цвета
export const CustomColors: Story = {
  render: Template,
  args: {
    totalSteps: 4,
    current: 2,
    activeFill: '#ff6b6b',
    inactiveFill: '#4ecdc4',
  },
};

// Сценарий: с дополнительным классом
export const WithCustomClass: Story = {
  render: Template,
  args: {
    totalSteps: 3,
    current: 2,
    customClass: 'my-custom-class',
  },
};
