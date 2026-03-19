import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import UserFavorites from './UserFavorites';
import type { User } from '../../../api/types';

// Моковые данные с правильным типом User
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Александр Иванов',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    dateOfBirth: '1990-01-01',
    gender: 'male',
    location: { id: 1, name: 'Белгород' },
    about: 'Опытный фронтенд разработчик',
    skillCanTeach: {
      id: 1,
      name: 'Создание веб-приложений на Vue.js 3',
      description: 'Научу создавать современные SPA приложения',
      subcategoryId: 1,
    },
    images: [],
    subcategoriesWantToLearn: [{ id: 1, name: 'Веб-разработка', categoryId: 1 }],
    greeting: 'Привет! Рад поделиться знаниями',
    likedUserIds: [],
    liked: 42,
  },
  {
    id: 2,
    name: 'Мария Петрова',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    dateOfBirth: '1989-01-01',
    gender: 'female',
    location: { id: 2, name: 'Санкт-Петербург' },
    about: 'Преподаватель английского языка',
    skillCanTeach: {
      id: 2,
      name: 'Английский для IT-специалистов',
      description: 'Специализированный курс английского',
      subcategoryId: 2,
    },
    images: [],
    subcategoriesWantToLearn: [{ id: 3, name: 'Проектное управление', categoryId: 2 }],
    greeting: "Hello! Let's learn English together",
    likedUserIds: [],
    liked: 28,
  },
];

// Создаём mock-store
const mockStore = configureStore({
  reducer: {},
  preloadedState: {},
});

const meta: Meta<typeof UserFavorites> = {
  title: 'Widgets/UserFavorites',
  component: UserFavorites,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof UserFavorites>;

const InteractiveFavorites = () => {
  const [users, setUsers] = useState(mockUsers);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleRemove = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  const handleUserClick = () => {};

  return (
    <div style={{ position: 'relative', minHeight: '400px' }}>
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            top: '150px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            fontWeight: '500',
            transition: 'opacity 0.3s ease-in-out',
            animation: 'fadeIn 0.3s',
          }}
        >
          Пользователь удален из Избранного
        </div>
      )}
      <UserFavorites users={users} onRemove={handleRemove} onUserClick={handleUserClick} />
    </div>
  );
};

export const Default: Story = {
  render: () => <InteractiveFavorites />,
};

export const Empty: Story = {
  args: {
    users: [],
    onRemove: () => {},
    onUserClick: () => {},
  },
};
