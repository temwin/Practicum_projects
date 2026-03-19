import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom'; // Импортируем MemoryRouter
import RegistrationWizard from './RegistrationWizard';
import type { RegistrationData } from './RegistrationWizard';

// Метаданные компонента
const meta: Meta<typeof RegistrationWizard> = {
  title: 'Widgets/RegistrationWizard',
  component: RegistrationWizard,
  tags: ['autodocs'],
  argTypes: {
    onLogoClick: { action: 'logoClicked' },
    onClose: { action: 'closed' },
    onSubmit: { action: 'submitted' },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        {' '}
        {/* Обёртываем стори в роутер */}
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RegistrationWizard>;

// Вспомогательные данные для стори
const mockData: RegistrationData = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Иван Иванов',
  birthDate: '1990-01-01',
  gender: 'male',
  city: 'Москва',
  wantToLearn: [
    { name: 'JavaScript', categoryId: 1, subcategoryId: 1 },
    { name: 'TypeScript', categoryId: 1, subcategoryId: 2 },
  ],
  avatarBase64: 'data:image/png;base64,...',
  skillName: 'React Development',
  categoryId: 1,
  subcategoryId: 2,
  description: 'Опытный разработчик React, готов делиться знаниями.',
  image: 'data:image/png;base64,...',
  imagesBase64: 'data:image/png;base64,...',
};

// Базовая история (все пропсы по умолчанию)
export const Default: Story = {
  args: {
    onLogoClick: () => {},
    onClose: () => {},
    onSubmit: () => {},
  },
};

// История с заполненными данными (шаг 1)
export const Step1Filled: Story = {
  args: {
    ...Default.args,
    onSubmit: () => {},
  },
  render: (args) => {
    const [data, setData] = React.useState<RegistrationData>(mockData);
    return (
      <RegistrationWizard
        {...args}
        onSubmit={(data) => {
          setData(data);
          args.onSubmit?.(data);
        }}
      />
    );
  },
};

// История для шага 2 (личная информация)
export const Step2: Story = {
  args: {
    ...Default.args,
    onSubmit: () => {},
  },
  render: (args) => {
    const [step, setStep] = React.useState(2);
    const [data, setData] = React.useState<RegistrationData>({});

    return (
      <div style={{ width: '1440px', height: '1024px' }}>
        <RegistrationWizard
          {...args}
          onSubmit={(formData) => {
            setData(formData);
            args.onSubmit?.(formData);
          }}
        />
      </div>
    );
  },
};

// История для шага 3 (навыки)
export const Step3: Story = {
  args: {
    ...Default.args,
    onSubmit: () => {},
  },
  render: (args) => {
    const [step] = React.useState(3);
    const [data, setData] = React.useState<RegistrationData>({});

    return (
      <div style={{ width: '1440px', height: '1024px' }}>
        <RegistrationWizard
          {...args}
          onSubmit={(formData) => {
            setData(formData);
            args.onSubmit?.(formData);
          }}
        />
      </div>
    );
  },
};

// История с ошибками валидации
export const WithValidationErrors: Story = {
  args: {
    ...Default.args,
    onSubmit: () => {},
  },
  render: (args) => {
    const [errors] = React.useState({
      email: 'Email обязателен',
      password: 'Пароль обязателен',
      wantToLearn: 'Выберите навык, которому хотите научиться',
      canTeach: 'Название навыка и описание обязательны',
    });

    return (
      <div style={{ width: '1440px', height: '1024px' }}>
        <RegistrationWizard {...args} />
      </div>
    );
  },
};

// История с кастомными обработчиками
export const CustomHandlers: Story = {
  args: {
    onLogoClick: () => alert('Logo clicked!'),
    onClose: () => {},
    onSubmit: (data) => {
      alert(`Регистрация завершена!\nEmail: ${data.email}\nName: ${data.name}`);
    },
  },
};
