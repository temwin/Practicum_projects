import type { Meta, StoryObj } from '@storybook/react';

import { CardThreeStepRegistration } from './CardThreeStepRegistration';
import type { CardThreeStepRegistrationProps } from './CardThreeStepRegistration';

// Тестовые данные для категорий и подкатегорий
const mockCategories = [
  { value: '1', label: 'Программирование' },
  { value: '2', label: 'Дизайн' },
  { value: '3', label: 'Языки' },
  { value: '4', label: 'Музыка' },
  { value: '5', label: 'Спорт' },
];

const mockSubcategories: Record<string, { value: string; label: string }[]> = {
  '1': [
    { value: '101', label: 'Frontend разработка' },
    { value: '102', label: 'Backend разработка' },
    { value: '103', label: 'Мобильная разработка' },
  ],
  '2': [
    { value: '201', label: 'UI дизайн' },
    { value: '202', label: 'UX дизайн' },
    { value: '203', label: 'Графический дизайн' },
  ],
  '3': [
    { value: '301', label: 'Английский язык' },
    { value: '302', label: 'Испанский язык' },
    { value: '303', label: 'Немецкий язык' },
  ],
  '4': [
    { value: '401', label: 'Гитара' },
    { value: '402', label: 'Фортепиано' },
    { value: '403', label: 'Вокал' },
  ],
  '5': [
    { value: '501', label: 'Йога' },
    { value: '502', label: 'Фитнес' },
    { value: '503', label: 'Бег' },
  ],
};

// Общие тестовые данные для форм
const mockDataFilled: CardThreeStepRegistrationProps['data'] = {
  skillName: 'Разработка на React',
  categoryId: 1,
  subcategoryId: 101,
  description: 'Учу создавать интерактивные веб‑приложения на React.',
  image:
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
  imagesBase64: 'data:image/png;base64,...',
};

const meta: Meta<CardThreeStepRegistrationProps> = {
  title: 'components/CardThreeStepRegistration',
  component: CardThreeStepRegistration,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    data: {
      control: { type: 'object' },
      description:
        'Данные формы (skillName, categoryId, subcategoryId, description, image, imagesBase64)',
    },
    errors: {
      control: { type: 'object' },
      description: 'Ошибки валидации (например, canTeach)',
    },
    onChange: {
      action: 'onChange',
      description: 'Обработчик изменения данных формы',
    },
    onBack: {
      action: 'onBack',
      description: 'Обработчик кнопки "Назад"',
    },
    onNext: {
      action: 'onNext',
      description: 'Обработчик кнопки "Далее"',
    },
  },
};

export default meta;

type Story = StoryObj<CardThreeStepRegistrationProps>;

// История: Пустая форма
export const EmptyForm: Story = {
  args: {
    data: {},
    errors: {},
    onChange: () => {},
    onBack: () => {},
    onNext: () => {},
  },
};

// История: Заполненная форма
export const FilledForm: Story = {
  args: {
    data: mockDataFilled,
    errors: { canTeach: 'Пожалуйста, заполните описание навыка' },
    onChange: () => {},
    onBack: () => {},
    onNext: () => {},
  },
};

// История: Форма с ошибкой (пустое название навыка)
export const FormWithError: Story = {
  args: {
    data: {
      ...mockDataFilled,
      skillName: '',
    },
    errors: { canTeach: 'Название навыка обязательно' },
    onChange: () => {},
    onBack: () => {},
    onNext: () => {},
  },
};

// История: Форма без кнопок навигации
export const FormNoButtons: Story = {
  args: {
    data: mockDataFilled,
    errors: {},
    onChange: () => {},
  },
};

// История: Форма только с кнопкой "Далее"
export const FormOnlyNextButton: Story = {
  args: {
    data: mockDataFilled,
    errors: {},
    onChange: () => {},
    onNext: () => {},
  },
};
