import type { Meta, StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useState } from 'react';

import { Error404PageUI } from './Error404PageUI';
import type { Error404PageUIProps } from './Error404PageUI';
import type { User } from '../../api/types';

// 1. Mock-данные для user
const mockUser: User = {
  id: 1,
  avatarUrl: '/mock-avatar.png',
  name: 'Анна Иванова',
  location: 1,
  dateOfBirth: '1990-05-15',
  gender: 'female',
  email: 'anna@example.com',
  about: 'Преподаватель английского языка.',
  greeting: 'Здравствуйте! Готова помочь.',
  createdAt: '2023-01-10T12:00:00Z',
  liked: 42,
  likedUserIds: [2, 3],
  skillCanTeach: {
    id: 101,
    subcategoryId: 20,
    name: 'Английский для начинающих',
    description: 'Основы грамматики.',
  },
  subcategoriesWantToLearn: [
    {
      id: 30,
      name: 'Испанский язык',
      categoryId: 5,
    },
  ],
  images: ['/images/user-1-1.jpg'],
};

// 2. Начальное состояние Redux
const mockInitialState = {
  user: {
    currentUser: mockUser,
    isAuthenticated: true,
  },
};

// 3. Редуктор (гарантирует не-null currentUser)
const userReducer = (
  state = mockInitialState.user
): { currentUser: User; isAuthenticated: boolean } => {
  return state;
};

// 4. Тип глобального состояния
type RootState = {
  user: {
    currentUser: User;
    isAuthenticated: boolean;
  };
};

// 5. Стор для Storybook
const store = configureStore({
  reducer: { user: userReducer },
  preloadedState: mockInitialState as RootState,
  middleware: (getDefault) => getDefault({ thunk: false, serializableCheck: false }),
});

// 6. Обёртка: ждёт загрузки currentUser
const WithUser = ({ children }: { children: React.ReactNode }) => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  if (!currentUser) return <div>Загрузка профиля...</div>;
  return <>{children}</>;
};

// 7. Мета-информация
const meta: Meta<typeof Error404PageUI> = {
  title: 'Pages/Error404PageUI',
  component: Error404PageUI,
  decorators: [
    (Story) => (
      <Provider store={store}>
        <MemoryRouter>
          <WithUser>
            <Story />
          </WithUser>
        </MemoryRouter>
      </Provider>
    ),
  ],
  argTypes: {
    errorType: {
      control: 'radio',
      options: [404, 500],
      description: 'Тип ошибки',
    },
    showHeader: {
      control: 'boolean',
      description: 'Показывать шапку',
      defaultValue: true,
    },
    showFooter: {
      control: 'boolean',
      description: 'Показывать подвал',
      defaultValue: true,
    },
    searchValue: {
      control: 'text',
      description: 'Значение поиска',
    },
    onSearchChange: {
      action: 'searchChange',
      description: 'onChange для поиска',
    },
    onRetry: {
      action: 'retry',
      description: 'Клик по "Повторить"',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Error404PageUI>;

// 8. Вспомогательный компонент: управляет searchValue
const ControlledError404PageUI = (args: Error404PageUIProps) => {
  const [searchValue, setSearchValue] = useState(args.searchValue || '');
  return <Error404PageUI {...args} searchValue={searchValue} onSearchChange={setSearchValue} />;
};

// 9. Истории
export const Page404: Story = {
  render: (args) => <ControlledError404PageUI {...args} />,
  args: {
    errorType: 404,
    showHeader: true,
    showFooter: true,
  },
  name: 'Страница 404 (с шапкой и подвалом)',
};

export const Page500: Story = {
  render: (args) => <ControlledError404PageUI {...args} />,
  args: {
    errorType: 500,
    showHeader: true,
    showFooter: true,
  },
  name: 'Страница 500 (с шапкой и подвалом)',
};

export const Minimal: Story = {
  render: (args) => <ControlledError404PageUI {...args} />,
  args: {
    errorType: 404,
    showHeader: false,
    showFooter: false,
  },
  name: 'Минималистичная версия (без шапки и подвала)',
};
